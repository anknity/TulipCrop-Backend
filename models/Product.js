import mongoose from 'mongoose';

const compositionItemSchema = new mongoose.Schema({
  component: { type: String, required: true },
  amount: { type: String, required: true },
}, { _id: false });

const applicationStepSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  instruction: { type: String, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  hindiName: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  badge: {
    type: String,
    trim: true,
    default: '',
  },
  technicalName: {
    type: String,
    trim: true,
    default: '',
  },
  activeIngredient: {
    type: String,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    required: true,
  },
  formulation: {
    type: String,
    trim: true,
    default: '',
  },
  packSize: {
    type: String,
    trim: true,
    default: '',
  },
  composition: {
    type: [compositionItemSchema],
    default: [],
  },
  dosage: {
    type: String,
    trim: true,
    default: '',
  },
  solubility: {
    type: String,
    trim: true,
    default: '',
  },
  cropType: {
    type: String,
    trim: true,
    default: 'Universal',
  },
  applicationMethod: {
    type: [applicationStepSchema],
    default: [],
  },
  targetPests: {
    type: String,
    trim: true,
    default: '',
  },
  modeOfAction: {
    type: String,
    trim: true,
    default: '',
  },
  toxicityLevel: {
    type: String,
    trim: true,
    default: '',
  },
  shelfLife: {
    type: String,
    trim: true,
    default: '2 Years',
  },
  manufacturer: {
    type: String,
    trim: true,
    default: 'TulipCrop (India) Pvt. Ltd.',
  },
  image: {
    type: String,
    default: '',
  },
  cloudinaryId: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
