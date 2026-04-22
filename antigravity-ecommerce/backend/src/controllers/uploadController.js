const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');

// @desc    Upload images to MongoDB GridFS
// @route   POST /api/upload, POST /api/upload/profile-pic
// @access  Private
const uploadImages = async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files provided' });
  }

  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    const results = await Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = bucket.openUploadStream(
            `${Date.now()}-${file.originalname}`,
            { metadata: { mimetype: file.mimetype } }
          );

          uploadStream.on('error', (err) => reject(err));
          uploadStream.on('finish', () => {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            resolve({
              url: `${baseUrl}/api/upload/image/${uploadStream.id}`,
              public_id: uploadStream.id.toString(),
            });
          });

          uploadStream.end(file.buffer);
        });
      })
    );

    res.json(results);
  } catch (err) {
    console.error('GridFS upload error:', err);
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
};

// @desc    Serve image from MongoDB GridFS
// @route   GET /api/upload/image/:id
// @access  Public
const getImage = async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    let fileId;
    try {
      fileId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid image ID' });
    }

    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', files[0].metadata?.mimetype || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on('error', () => res.status(500).json({ message: 'Error streaming image' }));
    downloadStream.pipe(res);
  } catch (err) {
    console.error('GridFS getImage error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = { uploadImages, getImage };
