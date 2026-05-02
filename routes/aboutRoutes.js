const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAbout, updateAbout, getVersions } = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${timestamp}-${sanitized}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  cb(null, allowedTypes.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

router.get('/', getAbout);
router.put('/', protect, upload.single('image'), updateAbout);
router.get('/versions', protect, getVersions);

module.exports = router;
