import 'dotenv/config';
import Groq from 'groq-sdk';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import jwt from 'jsonwebtoken';
import Product from './models/Product.js';
import auth from './middleware/auth.js';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ───────── MongoDB ───────── */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

/* ───────── Cloudinary ───────── */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tulipcrop-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 900, height: 700, crop: 'limit', quality: 'auto' }],
  },
});

const upload = multer({ storage });

const toClientProduct = (product) => {
  const normalized = product?.toObject ? product.toObject() : { ...product };
  const image = typeof normalized.image === 'string' ? normalized.image.trim() : '';
  const cloudinaryId = typeof normalized.cloudinaryId === 'string' ? normalized.cloudinaryId.trim() : '';

  if (!image && cloudinaryId) {
    normalized.image = cloudinary.url(cloudinaryId, { secure: true });
  }

  return normalized;
};

/* ───────── Admin Login ───────── */
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASS) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ token, email });
});

/* ───────── Chatbot Route ───────── */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Fetch all products to give AI full context
    const products = await Product.find().lean();
    const productSummary = products.map((p) =>
      `- ${p.name} (${p.category}): ${p.activeIngredient || p.technicalName || ''}, Pack: ${p.packSize || 'N/A'}, Dosage: ${p.dosage || 'N/A'}, Crops: ${p.cropType || 'N/A'}`
    ).join('\n');

    const systemPrompt = `You are TulipBot, a friendly and knowledgeable AI assistant for TulipCrop (India) Pvt. Ltd. — a premium agricultural products company.

About TulipCrop:
- Manufacturer and marketer of high-quality agrochemicals, fertilizers, bio-stimulants, and plant growth regulators.
- Product range includes Insecticides, Fungicides, Herbicides, Fertilizers, PGR and Bio Products.
- Manufacturer: TulipCrop (India) Pvt. Ltd.
- Website: tulipcrop.in
- Admin email: admin@tulipcrop.in
- All products have a shelf life of 2 years.
- Products are designed for Indian farmers and crops like Paddy, Wheat, Cotton, Maize, Vegetables, Fruits, Pulses, Soybean, Sugarcane, and more.

Current Product Catalog (${products.length} products):
${productSummary}

Your rules:
1. ONLY answer the user's specific question. Do NOT over-explain or provide unnecessary details.
2. Be extremely concise and direct. Avoid conversational filler, preambles, or long conclusions.
3. Use a structured, easy-to-read format (e.g., bullet points) when listing products or categories.
4. If asked about product categories, just list the names of the categories we offer.
5. If asked about something outside TulipCrop, politely redirect to TulipCrop-related topics.
6. Always respond in the same language the user writes in (Hindi or English).`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 600,
      temperature: 0.6,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Chatbot error: ' + err.message });
  }
});

/* ───────── Public Routes ───────── */
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products.map(toClientProduct));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(toClientProduct(product));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id/similar', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const similar = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(3);
    res.json(similar.map(toClientProduct));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ───────── Admin Routes (Protected) ───────── */
app.post('/api/products', auth, upload.single('image'), async (req, res) => {
  try {
    const parseJSONField = (field) => {
      if (!field) return undefined;
      if (typeof field === 'string') {
        try { return JSON.parse(field); } catch (e) { return field; }
      }
      return field;
    };

    const productData = {
      name: req.body.name,
      hindiName: req.body.hindiName,
      technicalName: req.body.technicalName,
      category: req.body.category,
      badge: req.body.badge || '',
      activeIngredient: req.body.activeIngredient || '',
      description: req.body.description,
      formulation: req.body.formulation || '',
      packSize: req.body.packSize || '',
      dosage: req.body.dosage,
      solubility: req.body.solubility,
      cropType: req.body.cropType,
      targetPests: parseJSONField(req.body.targetPests),
      modeOfAction: req.body.modeOfAction,
      toxicityLevel: req.body.toxicityLevel,
      shelfLife: req.body.shelfLife,
      manufacturer: req.body.manufacturer,
      composition: parseJSONField(req.body.composition),
      applicationMethod: parseJSONField(req.body.applicationMethod),
      image: req.file ? req.file.path : '',
      cloudinaryId: req.file ? req.file.filename : '',
    };

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // If new image uploaded, delete old one from Cloudinary
    if (req.file && product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
    }

    const parseJSONField = (field) => {
      if (!field) return undefined;
      if (typeof field === 'string') {
        try { return JSON.parse(field); } catch (e) { return field; }
      }
      return field;
    };

    const updateData = {
      name: req.body.name ?? product.name,
      hindiName: req.body.hindiName ?? product.hindiName,
      technicalName: req.body.technicalName ?? product.technicalName,
      category: req.body.category ?? product.category,
      badge: req.body.badge ?? product.badge,
      activeIngredient: req.body.activeIngredient ?? product.activeIngredient,
      description: req.body.description ?? product.description,
      formulation: req.body.formulation ?? product.formulation,
      packSize: req.body.packSize ?? product.packSize,
      dosage: req.body.dosage ?? product.dosage,
      solubility: req.body.solubility ?? product.solubility,
      cropType: req.body.cropType ?? product.cropType,
      targetPests: req.body.targetPests ?? product.targetPests,
      modeOfAction: req.body.modeOfAction ?? product.modeOfAction,
      toxicityLevel: req.body.toxicityLevel ?? product.toxicityLevel,
      shelfLife: req.body.shelfLife ?? product.shelfLife,
      manufacturer: req.body.manufacturer ?? product.manufacturer,
      composition: req.body.composition !== undefined ? parseJSONField(req.body.composition) : product.composition,
      applicationMethod: req.body.applicationMethod !== undefined ? parseJSONField(req.body.applicationMethod) : product.applicationMethod,
    };

    if (req.file) {
      updateData.image = req.file.path;
      updateData.cloudinaryId = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Delete image from Cloudinary
    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ───────── Start Server ───────── */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
