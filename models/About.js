const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  headline: {
    type: String,
    required: [true, 'Headline is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  mission: {
    type: String,
    required: [true, 'Mission is required']
  },
  vision: {
    type: String,
    required: [true, 'Vision is required']
  },
  image_url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('About', AboutSchema);
