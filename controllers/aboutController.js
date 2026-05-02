const fs = require('fs');
const path = require('path');
const About = require('../models/About');
const Version = require('../models/Version');

const getAbout = async (req, res) => {
  const about = await About.findOne({});

  if (!about) {
    res.status(404).json({ success: false, message: 'About content not found.' });
    return;
  }

  res.json({ success: true, data: about });
};

const updateAbout = async (req, res) => {
  const { company_name, headline, description, mission, vision, image_url } = req.body;

  if (!company_name || !headline || !description || !mission || !vision) {
    res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    return;
  }

  const about = await About.findOne({});

  if (!about) {
    res.status(404).json({ success: false, message: 'About record not found.' });
    return;
  }

  const previousData = {
    company_name: about.company_name,
    headline: about.headline,
    description: about.description,
    mission: about.mission,
    vision: about.vision,
    image_url: about.image_url
  };

  let finalImageUrl = image_url || about.image_url;

  if (req.file) {
    const filePath = `/uploads/${req.file.filename}`;
    finalImageUrl = filePath;

    if (about.image_url && about.image_url.startsWith('/uploads/') && about.image_url !== filePath) {
      const currentFile = path.join(__dirname, '..', about.image_url);
      if (fs.existsSync(currentFile)) {
        fs.unlinkSync(currentFile);
      }
    }
  }

  about.company_name = company_name;
  about.headline = headline;
  about.description = description;
  about.mission = mission;
  about.vision = vision;
  about.image_url = finalImageUrl;
  about.updated_at = new Date();

  const updatedAbout = await about.save();

  const changes = {};
  Object.keys(previousData).forEach((field) => {
    if (previousData[field] !== updatedAbout[field]) {
      changes[field] = { from: previousData[field], to: updatedAbout[field] };
    }
  });

  await Version.create({
    about_ref: about._id,
    updated_at: new Date(),
    editor: req.admin?.email || 'Admin',
    changes
  });

  res.json({ success: true, data: updatedAbout, message: 'About content updated successfully.' });
};

const getVersions = async (req, res) => {
  const about = await About.findOne({});

  if (!about) {
    res.status(404).json({ success: false, message: 'About content not found.' });
    return;
  }

  const versions = await Version.find({ about_ref: about._id })
    .sort({ updated_at: -1 })
    .limit(10);

  res.json({ success: true, data: versions });
};

module.exports = { getAbout, updateAbout, getVersions };
