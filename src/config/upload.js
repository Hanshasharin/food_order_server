// const multer = require('multer')
// const { CloudinaryStorage } = require('multer-storage-cloudinary')
// const cloudinary = require('../config/cloudinary') // path to your cloudinary config

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'profile_pics', // optional: folder in your cloudinary
//     allowed_formats: ['jpg', 'png', 'jpeg'],
//     transformation: [{ width: 500, height: 500, crop: 'limit' }]
//   },
// })

// const parser = multer({ storage: storage })

// module.exports = parser

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // path to your configured Cloudinary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'food_order',
    resource_type: 'image',
    // public_id: Date.now().toString(), // optional: name file based on timestamp
    // transformation: [{ width: 500, height: 500, crop: 'limit' }] // ❌ REMOVE FOR NOW
    // allowed_formats: ['jpg', 'png', 'jpeg'] // ❌ REMOVE FOR NOW
  }),
});

const parser = multer({ storage });

module.exports = parser;
