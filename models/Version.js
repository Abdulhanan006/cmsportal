const mongoose = require('mongoose');

const VersionSchema = new mongoose.Schema({
  about_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'About',
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  changes: {
    type: Object,
    default: {}
  },
  editor: {
    type: String,
    default: 'Admin'
  }
});

module.exports = mongoose.model('Version', VersionSchema);
