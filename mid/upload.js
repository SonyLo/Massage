const multer = require('multer')
const moment = require('moment')
var cloudinary = require('cloudinary')

cloudinary.config({ 
  cloud_name: 'hv0k0blas', 
  api_key: '583531197261961', 
  api_secret: 'SADkHOBUYtQQQPwenlbR9BS7v6o' 
});




console.log('1')
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS')
    cb(null, `${date}-${file.originalname}`)
  }
})
console.log('2')
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const limits = {
  fileSize: 1024 * 1024 * 5
}

module.exports = multer({storage, fileFilter, limits})