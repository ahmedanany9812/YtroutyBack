const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 5000000,
  },
}).single("postmedia");
const uploadMedia = (req, res, next) => {
  let errors = [];
  upload(req, res, (err) => {
    if (err) {
      errors.push("MediaFile should be less than 3MB");
      return res.status(400).json({ errors });
    }
    next();
  });
};
module.exports = uploadMedia;
