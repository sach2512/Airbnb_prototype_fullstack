const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.Cloud_Name,
api_key:process.env.Cloud_Apikey,
api_secret:process.env.Cloud_API_Secret,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'air_bnb_development',
      allowedformats: ["png","jpeg","jpg"],
      
    },
  })

  module.exports={
    cloudinary,
    storage,
  }