const multer = require("multer");
const ApiError = require("../utils/apiError");

// 1-DiskStorage solution
// const multerstorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     // category-${id}-Data.now().jpeg
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

// This function return middleware
exports.uploadSingleImage = (fieldNmae) => {
  // 2) Memeory Storage engine
  const multerstorage = multer.memoryStorage({});

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerstorage, fileFilter: multerFilter });
  return upload.single(fieldNmae);
};
