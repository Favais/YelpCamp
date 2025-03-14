const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloudinaryName,
    api_key: process.env.cloudinaryKey,
    api_secret: process.env.cloudinarySecret
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'yelpcamp',
        allowedFormat: ['jpeg', 'png', 'jpg', 'pdf']
    }
})

module.exports = {
    cloudinary,
    storage
}