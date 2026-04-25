import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const masterListByCategory = {
  Insecticide: [
    'TEMPLIGO - Chlorantraniliprole 9.3% + Lambda Cyhalothrin 4.6% ZC',
    'SAMA - Emamectin Benzoate 1.5% + Fipronil 3.5% SC',
    'JUDO TARA - Thiamethoxam 12.6% + Lambda Cyhalothrin 9.5% ZC',
    'SAMRAT - Fipronil 2.92% EC',
    'LASINO POWER - Pyriproxifen 10% EC',
    'CONFIDENCE SUPER - Imidacloprid 30% SC',
    'LOBAAN SUPER - Emamectin Benzoate 1.9% EC',
    'KITE - Tolfenpyrad 15% EC',
    'NEOTHRIN - Bifenthrin 10% EC',
    'CONFIDENCE - Imidacloprid 17.8% SL',
    'RUFFLE - Pyriproxifen 5% + Diafenthiuron 25% SE',
    'RUBINA - Azoxystrobin 2.5% + Thiophanate Methyl 11.25% + Thiamethoxam 25% FS',
    'LOBAAN - Emamectin Benzoate 5% SG',
    'TARALIP - 75 - Thiamethoxam 75% SG',
    'JODI NO.1 - Dinotefuran 15% + Pymetrozine 45% WG',
    'TXLA - Chlorpyriphos 20%',
    'POLY C - 404 - Profenofos 40% + Cypermethrin 4% EC',
    'WARRIOR - Chlorantraniliprole 18.5% SC',
    'KLINCH - Pymetrozine 50% WG',
    'TARALIP - Thiamethoxam 25% WG',
    'LOREEN POWER - Dinotefuran 20% SG',
    'TERMINAL 4.9 - Lambda Cyhalothrin 4.9% CS',
    'CIRCLE - Chlorpyriphos 50% + Cypermethrin 5% EC',
    'CONFIDENCE GOLD - Imidacloprid 70% WG',
    'MONOKILL - Monocrotophos 36% SL',
    'JUDO - 5 - Lambda Cyhalothrin 5% EC',
    'TIGOR - Dimethoate 30% EC',
    'MARIA - Carbofuran 3% GR',
    'TORIO - Cartap Hydrochloride 4% GR',
    'GENTO - Fipronil 0.3% GR',
    'TARALIP PLUS - Thiamethoxam 30% FS',
    'WAZRA - Quinalphos 25% EC',
    'HAMMER - Emamectin Benzoate 0.9% SC',
    'FUMIX - Imidacloprid 0.3% GR',
    'FENCI - Fenvalerate 0.4% DP',
    'JUPITER - Fipronil 40% + Imidacloprid 40% WG',
  ],
  Fungicide: [
    'ARIAN TOP - Azoxystrobin 11% + Tebuconazole 18.3% SC',
    'FUJITA - Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
    'TOXIN - Azoxystrobin 23% SC',
    'TULIP CT - 100 - Tebuconazole 6.7% + Captan 26.9% SC',
    'TASSILO - Propiconazole 25% EC',
    'TELLIS - Hexaconazole 5% SC',
    'BENCIO - Tebuconazole 38.39% SC',
    'RUBICA - Azoxystrobin 16.7% SC + Tricyclazole 30.3% SC',
    'BLUEWALE - Copper Oxychloride 50% WP',
    'TEBULIP - Tebuconazole 25.9% EC',
    'TELLIS GOLD - Hexaconazole 75% WG',
    'AJUBBA - Tebuconazole 10% + Sulphur 65% WG',
    'TEBULIP DS - Tebuconazole 2% DS',
    'MAXLIP - 80 - Sulphur 80% WDG',
    'COMBI STAR - Carbendazim 12% + Mancozeb 63% WP',
    'KAMAAN - Tricyclazole 75% WP',
    'COLIP - Propineb 70% WP',
    'TULIP M-45 - Mancozeb 75% WP',
    'ZOGER - Thiophanate Methyl 70% WP',
    'LUXARY - Metalaxyl 8% + Mancozeb 64% WP',
    'RAXCIL EASY - Tebuconazole 5.36% FS',
    'BIJO - Chlorothalonil 75% WP',
    'HEMPER - Captan 70% + Hexaconazole 5% WP',
    'ARIAN GLOW - Azoxystrobin 11.5% + Mancozeb 30% WP',
  ],
  Herbicide: [
    'TURIN-25 - Chlorimuron Ethyl 25% WP',
    'FLAME - Clodinafop-Propargyl 15% WP',
    'TAJVEER - Atrazine 70% WP',
    'TIFIT-N - Pretilachlor 30.7% EC',
    'HUNGAMA - Quizalofop-Ethyl 10% EC',
    'OXYGEN - Oxyfluorfen 23.5% EC',
    'SAFAYA - Glufosinate Ammonium 13.5% SL',
    'PENDOR - Pendimethalin 30% EC',
    'PAUSE-24 - Paraquat Dichloride 24% SL',
    'METRON - Metsulfuron Methyl 20%',
    'SUITUP - Imazethapyr 10% SL',
    'LAMBODIS - Tembotrione 34.4% SC',
    'TENCOR - Metribuzin 70% WP',
    'PYRI-GOLD - Bispyribac Sodium 10% SC',
    'BREAKER - Fenoxaprop-P-Ethyl 10% EC',
    'TIFIT PLUS - Pretilachlor 37% EW',
    'AAFULA - Pyroxasulfone 85% WG',
    'READER - Sulfosulfuron 75% WG',
    'ZORA-38 - 2,4-D Ethyl Ester 38% EC',
    'TARZAN-41 - Glyphosate 41% SL',
    'TARZAN-71 - Ammonium Salt of Glyphosate 71% SG',
    'ZORA-58 - 2,4-D Amine Salt 58% SL',
    'PENDOR SUPER - Pendimethalin 38.7% CS',
    'TIFIT - Pretilachlor 50% EC',
  ],
  Fertilizers: [
    'HYLEX - N:P:K 11:11:8',
    'EVEREST - N:P:K 13:00:45',
    'ARMADA - N:P:K 00:52:34',
    'MAXLIP - 90 - Sulphur 90% WDG',
    'DHARTI PROM - Phosphate Rich Organic Manure',
    'T-POTASH - Potash Derived from Molasses',
    'RAKSHAK - N:P:K 19:19:19',
    'T-MAGANESE - Manganese 30.5% + Sulphur 17%',
    'T-MAGNESIUM - Magnesium 9.5% + Sulphur 12%',
    'ZINC 33 - Zinc 33%, Sulphur 15%',
    'ZINCOLIP - Zn-EDTA 12%',
    'TULIP ZINC - 700 - Zinc Oxide Suspension 39.5%',
  ],
  'PGR / BIO': [
    'ATONIC - Plant Growth Regulator',
    'AAIDEN - Gibberellic Acid 0.001% L',
    'STICK ONE - Silicone Surfactant',
    'FUMIKO - Bio-Enriched Organic Manure',
    'ROOTS GOLD - Mycorrhiza',
    'TULIP RAJA - Mycorrhiza',
    'ISRAEL KING - Plant Biostimulant',
    'KRISHMA - Humic Acid 95%',
    'PANTHER - Plant Growth Regulator',
    'MICRO CULLAN - Triacontanol GR 0.05% Min',
    'BAHUBALI - Gibberellic Acid 0.001% L',
    '24 KARAT - Super Potassium Humate 98% Flakes',
    'TULIP ZSB - Zinc Solubilising Bio-Fertilizers',
    'TULIP KMB - Potash Mobilising Bio-Fertilizers',
    'TULIP PSB - Phosphate Solubilizing Bacteria',
    'PACLO - Paclobutrazol 23% SC',
    'PLUSH + - Potash Liquid',
    'NEEM 1500 - Neem Oil (1500 PPM)',
  ],
};

const pgrKeywords = /plant growth regulator|gibberellic|paclobutrazol|triacontanol/i;

const normalizeName = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')
  .trim();

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getFormulation = (compositionText) => {
  const match = compositionText.match(/\b(ZC|SC|EC|SE|FS|SG|WG|CS|SL|GR|DP|WP|WDG|EW|DS)\b\s*$/i);
  return match ? match[1].toUpperCase() : '';
};

const getPackSize = (category) => {
  if (category === 'Fertilizers' || category === 'Bio Products') {
    return '1 kg / 5 kg / 10 kg';
  }
  if (category === 'PGR') {
    return '100 ml / 250 ml / 500 ml';
  }
  return '100 ml / 250 ml / 500 ml / 1 L';
};

const getDosage = (category, formulation) => {
  if (category === 'Fertilizers') return '2-5 kg/acre or as per crop stage';
  if (category === 'Bio Products') return '1-2 kg/acre or 2-3 ml/litre';
  if (category === 'PGR') return '0.3-1 ml/litre of water';
  if (formulation === 'GR' || formulation === 'DP') return '4-10 kg/acre';
  if (formulation === 'WP' || formulation === 'WG' || formulation === 'SG') return '80-200 g/acre';
  return '150-400 ml/acre';
};

const getCropType = (category) => {
  if (category === 'Herbicide') return 'Paddy, Wheat, Maize, Soybean, Sugarcane';
  if (category === 'Fungicide') return 'Paddy, Wheat, Vegetables, Fruits, Pulses';
  if (category === 'Insecticide') return 'Cotton, Paddy, Chilli, Vegetables, Pulses';
  if (category === 'Fertilizers') return 'All major crops';
  return 'Vegetables, Fruits, Cereals, Pulses';
};

const getTargetPests = (category) => {
  if (category === 'Insecticide') return 'Aphids, Jassids, Thrips, Borers, Leaf folders and other sucking/chewing pests';
  if (category === 'Fungicide') return 'Blast, blight, downy mildew, powdery mildew, rust and leaf spot diseases';
  if (category === 'Herbicide') return 'Annual grasses, broadleaf weeds and sedges';
  if (category === 'Fertilizers') return 'Nutrient deficiencies and crop stress conditions';
  if (category === 'PGR') return 'Flower drop, weak vegetative growth, poor fruit setting';
  return 'Soil health issues, nutrient uptake constraints and stress management';
};

const getModeOfAction = (category) => {
  if (category === 'Insecticide') return 'Systemic and contact action with quick knockdown and residual control';
  if (category === 'Fungicide') return 'Preventive and curative disease control through systemic/contact action';
  if (category === 'Herbicide') return 'Selective or non-selective weed control based on active ingredient';
  if (category === 'Fertilizers') return 'Supplies essential nutrients for balanced growth and higher productivity';
  if (category === 'PGR') return 'Regulates physiological growth for better flowering and fruiting';
  return 'Improves nutrient mobilization, root health and overall crop vigor';
};

const getBadge = (category) => {
  if (category === 'Insecticide') return 'Pest Control';
  if (category === 'Fungicide') return 'Disease Control';
  if (category === 'Herbicide') return 'Weed Control';
  if (category === 'Fertilizers') return 'Plant Nutrition';
  if (category === 'PGR') return 'Growth Regulator';
  return 'Bio Stimulant';
};

const getDescription = (category, compositionText) => {
  if (category === 'Insecticide') {
    return `Effective insecticide for controlling major sucking and chewing pests. Built with ${compositionText} for consistent field protection.`;
  }
  if (category === 'Fungicide') {
    return `Broad-spectrum fungicide designed to manage major fungal diseases. Formulated with ${compositionText} for preventive and curative performance.`;
  }
  if (category === 'Herbicide') {
    return `Reliable herbicide for strong weed management in field crops. Powered by ${compositionText} for cleaner fields and better crop growth.`;
  }
  if (category === 'Fertilizers') {
    return `Crop nutrition product that supports healthy development and improved yield. Composition includes ${compositionText} for balanced nourishment.`;
  }
  if (category === 'PGR') {
    return `Plant growth regulator that supports balanced vegetative and reproductive growth. Contains ${compositionText} for improved crop performance.`;
  }
  return `Bio-input developed to improve soil and crop health. Contains ${compositionText} to support stress tolerance and better nutrient use.`;
};

const getApplicationMethod = (category) => {
  if (category === 'Fertilizers' || category === 'Bio Products') {
    return [
      { step: 1, title: 'Prepare', instruction: 'Measure the recommended quantity as per crop stage and area.' },
      { step: 2, title: 'Apply', instruction: 'Apply through soil or foliar route uniformly in the field.' },
      { step: 3, title: 'Irrigate', instruction: 'Provide light irrigation after application for better uptake.' },
    ];
  }

  return [
    { step: 1, title: 'Mix', instruction: 'Dilute the recommended dose in clean water and stir well.' },
    { step: 2, title: 'Spray', instruction: 'Spray uniformly on target crop surface during calm weather.' },
    { step: 3, title: 'Repeat', instruction: 'Repeat at 10-15 day interval if pest or disease pressure persists.' },
  ];
};

const parseComposition = (compositionText) => {
  const cleaned = compositionText.replace(/\s+/g, ' ').trim();

  const npkMatch = cleaned.match(/N:P:K\s*([0-9:]+)/i);
  if (npkMatch) {
    return [{ component: 'N:P:K', amount: npkMatch[1] }];
  }

  const ppmMatch = cleaned.match(/^(.*)\(([^)]+)\)$/);
  if (ppmMatch) {
    return [{ component: ppmMatch[1].trim(), amount: ppmMatch[2].trim() }];
  }

  const chunks = cleaned
    .split(/\s*\+\s*|\s*,\s*/)
    .map((c) => c.trim())
    .filter(Boolean);

  return chunks.map((chunk) => {
    const match = chunk.match(/^(.*?)(\d+(?:\.\d+)?%\s*(?:[a-zA-Z.]+)?)$/);
    if (match) {
      return {
        component: match[1].trim(),
        amount: match[2].trim(),
      };
    }
    return { component: chunk, amount: 'As per label claim' };
  });
};

const parseProductLine = (line) => {
  const normalized = line.replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
  const parts = normalized.split(/\s+-\s+/).map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  return {
    name: parts.slice(0, -1).join(' ').trim(),
    compositionText: parts[parts.length - 1].trim(),
  };
};

const resolveCategory = (rawCategory, compositionText) => {
  if (rawCategory !== 'PGR / BIO') return rawCategory;
  return pgrKeywords.test(compositionText) ? 'PGR' : 'Bio Products';
};

const buildProduct = (rawCategory, rawLine, existingMediaMap) => {
  const parsed = parseProductLine(rawLine);
  if (!parsed) return null;

  const category = resolveCategory(rawCategory, parsed.compositionText);
  const formulation = getFormulation(parsed.compositionText);
  const media = existingMediaMap.get(normalizeName(parsed.name)) || {};

  return {
    name: parsed.name,
    hindiName: '',
    category,
    badge: getBadge(category),
    technicalName: parsed.compositionText,
    activeIngredient: parsed.compositionText,
    description: getDescription(category, parsed.compositionText),
    formulation,
    packSize: getPackSize(category),
    composition: parseComposition(parsed.compositionText),
    dosage: getDosage(category, formulation),
    solubility: 'Stable in recommended spray solution',
    cropType: getCropType(category),
    applicationMethod: getApplicationMethod(category),
    targetPests: getTargetPests(category),
    modeOfAction: getModeOfAction(category),
    toxicityLevel: category === 'Fertilizers' || category === 'Bio Products' ? 'Low' : 'Use as per label precautions',
    shelfLife: '2 Years',
    manufacturer: 'TulipCrop (India) Pvt. Ltd.',
    image: media.image || '',
    cloudinaryId: media.cloudinaryId || '',
  };
};

const buildMasterProducts = (existingMediaMap) => {
  const all = [];
  for (const [category, lines] of Object.entries(masterListByCategory)) {
    for (const line of lines) {
      const product = buildProduct(category, line, existingMediaMap);
      if (product) {
        all.push(product);
      }
    }
  }
  return all;
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const existingProducts = await Product.find({}, { name: 1, image: 1, cloudinaryId: 1 }).lean();
    const existingMediaMap = new Map();

    for (const product of existingProducts) {
      const hasImage = typeof product.image === 'string' && product.image.trim() !== '';
      if (!hasImage) continue;

      const key = normalizeName(product.name || '');
      if (!key || existingMediaMap.has(key)) continue;

      existingMediaMap.set(key, {
        image: product.image,
        cloudinaryId: product.cloudinaryId || '',
      });
    }

    const products = buildMasterProducts(existingMediaMap);
    const keepNames = new Set(products.map((p) => p.name));

    for (const product of products) {
      const nameRegex = new RegExp(`^${escapeRegExp(product.name)}$`, 'i');
      await Product.findOneAndUpdate(
        { name: nameRegex },
        { $set: product },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    await Product.deleteMany({ name: { $nin: [...keepNames] } });

    console.log(`Seeding complete: ${products.length} products upserted.`);
    console.log(`Preserved images for ${existingMediaMap.size} matched product(s).`);
  } catch (err) {
    console.error('Seed error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
