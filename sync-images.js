import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Product from './models/Product.js';

const IMAGE_ROOT = path.resolve(process.cwd(), '..', '..', 'Tulipcrop- product');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const normalize = (value) => String(value || '')
  .toUpperCase()
  .replace(/KAROT/g, 'KARAT')
  .replace(/NO\.?\s*1/g, 'NO1')
  .replace(/[^A-Z0-9]+/g, '')
  .trim();

const slugify = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const collectImageFiles = (rootDir) => {
  const items = fs.readdirSync(rootDir, { withFileTypes: true });
  const files = [];

  for (const item of items) {
    const fullPath = path.join(rootDir, item.name);
    if (item.isDirectory()) {
      files.push(...collectImageFiles(fullPath));
      continue;
    }

    if (/\.(png|jpg|jpeg|webp)$/i.test(item.name)) {
      files.push(fullPath);
    }
  }

  return files;
};

const buildProductMap = (products) => {
  const map = new Map();
  for (const product of products) {
    const key = normalize(product.name);
    if (!key || map.has(key)) continue;
    map.set(key, product);
  }
  return map;
};

const findProductForFile = (filePath, productMap) => {
  const baseName = path.parse(filePath).name;
  const directKey = normalize(baseName);
  if (productMap.has(directKey)) {
    return productMap.get(directKey);
  }

  const simplified = normalize(
    baseName
      .replace(/[_-]+/g, ' ')
      .replace(/\(.*?\)/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );

  if (productMap.has(simplified)) {
    return productMap.get(simplified);
  }

  return null;
};

async function syncImages() {
  if (!fs.existsSync(IMAGE_ROOT)) {
    console.error(`Image folder not found: ${IMAGE_ROOT}`);
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  try {
    const products = await Product.find({}, { name: 1, category: 1 }).lean();
    const productMap = buildProductMap(products);
    const imageFiles = collectImageFiles(IMAGE_ROOT);

    let uploaded = 0;
    let skipped = 0;
    const unmatchedFiles = [];

    for (const filePath of imageFiles) {
      const product = findProductForFile(filePath, productMap);
      if (!product) {
        unmatchedFiles.push(path.basename(filePath));
        skipped += 1;
        continue;
      }

      const publicId = `tulipcrop-products/${product.category}/${slugify(product.name)}`;

      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
        transformation: [{ width: 900, height: 700, crop: 'limit', quality: 'auto' }],
      });

      await Product.findByIdAndUpdate(product._id, {
        image: result.secure_url,
        cloudinaryId: result.public_id,
      });

      uploaded += 1;
      console.log(`Mapped: ${product.name} <- ${path.basename(filePath)}`);
    }

    console.log(`Image sync complete. Uploaded/mapped: ${uploaded}, skipped: ${skipped}`);
    if (unmatchedFiles.length > 0) {
      console.log('Unmatched files:', unmatchedFiles.slice(0, 25).join(', '));
    }
  } finally {
    await mongoose.disconnect();
  }
}

syncImages().catch((err) => {
  console.error('Image sync failed:', err);
  process.exit(1);
});
