const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Ensure local uploads directories exist
const uploadsDir = path.join(__dirname, '../../uploads');
const clientPublicUploadsDir = path.join(__dirname, '../../../client/public/uploads');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(clientPublicUploadsDir)) fs.mkdirSync(clientPublicUploadsDir, { recursive: true });
} catch (e) {
  console.warn('Could not initialize local upload folders:', e.message);
}

// @desc    Upload image or resume file
// @route   POST /api/v1/upload
// @access  Private (Admin)
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  // Determine resource type: 'raw' for PDF documents, 'auto' / 'image' for images
  const isPdf = req.file.mimetype === 'application/pdf';
  const resourceType = isPdf ? 'raw' : 'auto';
  const cleanOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const safeFileName = `${Date.now()}-${cleanOriginalName}`;

  // If PDF, persist locally so it can always be downloaded/viewed
  // without being blocked by Cloudinary's default raw/PDF ACL restrictions
  let localFileUrl = null;
  if (isPdf) {
    try {
      const targetPath = path.join(uploadsDir, safeFileName);
      fs.writeFileSync(targetPath, req.file.buffer);
      // Also save to client/public/uploads for direct static serving
      const clientPath = path.join(clientPublicUploadsDir, safeFileName);
      fs.writeFileSync(clientPath, req.file.buffer);
      localFileUrl = `/uploads/${safeFileName}`;
    } catch (fsErr) {
      console.warn('Could not save local PDF copy:', fsErr.message);
    }
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'anshika-portfolio',
      resource_type: resourceType,
      public_id: safeFileName
    },
    (error, result) => {
      // If Cloudinary errors out but local PDF succeeded, return local URL
      if (error && localFileUrl) {
        return res.status(200).json({
          url: localFileUrl,
          public_id: safeFileName,
          bytes: req.file.size
        });
      }

      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Upload failed: ' + error.message });
      }

      // For PDFs, use the reliable local/proxied route so browser PDF viewer never fails with 401 ACL error
      const finalUrl = isPdf && localFileUrl ? localFileUrl : result.secure_url;

      res.status(200).json({
        url: finalUrl,
        cloudinary_url: result.secure_url,
        public_id: result.public_id,
        bytes: result.bytes,
        format: result.format
      });
    }
  );

  uploadStream.end(req.file.buffer);
});

module.exports = router;
