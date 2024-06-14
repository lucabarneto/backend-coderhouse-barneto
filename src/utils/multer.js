const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "avatar":
        cb(null, __dirname + "/../public/uploads/avatars");
        break;
      case "thumbnails":
        cb(null, __dirname + "/../public/uploads/thumbnails");
        break;
      case "document":
        cb(null, __dirname + "/../public/uploads/documents");
        break;
    }
  },
  filename: (req, file, cb) => {
    cb(null, req.user._id + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
