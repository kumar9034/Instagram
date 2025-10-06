const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "music") {
      return {
        folder: "instagram/music",
        resource_type: "video", // audio ke liye required
        format: "mp3",
      };
    }
    if (file.fieldname === "cover") {
      return {
        folder: "instagram/covers",
        resource_type: "image",
      };
    }
    return {
      folder: "instagram/other",
      resource_type: "auto",
    };
  },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "music") {
    if (file.mimetype.startsWith("audio/")) cb(null, true);
    else cb(new Error("Only audio files allowed for music"), false);
  } else if (file.fieldname === "cover") {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed for cover"), false);
  } 
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});
