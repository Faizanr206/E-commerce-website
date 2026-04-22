const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImages, getImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

// Memory storage — files are streamed to MongoDB GridFS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  },
});

router.get('/test', (req, res) => res.json({ message: 'Upload route is active' }));
router.get('/image/:id', getImage);  // Serve image from MongoDB GridFS
router.post('/', protect, admin, upload.array('images', 5), uploadImages);
router.post('/profile-pic', protect, upload.single('image'), uploadImages);

module.exports = router;
