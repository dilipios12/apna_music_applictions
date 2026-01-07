const multer = require("multer");
const path = require("path");

const uploadimage = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/upload"); // Folder to store images and songs
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".mp3"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only .jpg, .jpeg, .png, and .mp3 files are allowed"));
    }
    cb(null, true);
  };

  return multer({ storage, fileFilter }).fields([
    { name: "Image", maxCount: 1 },
    { name: "songurl", maxCount: 1 },
  ]);
};

module.exports = uploadimage;






// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// // Function to determine the upload path based on the request URL
// const getUploadPath = (url) => {
//   if (url.includes("fake_driver")) {
//     return path.join(__dirname, "../public/images/fake_drivers");
//   } else if (url.includes("programming")) {
//     return path.join(__dirname, "../public/upload");
//   } else if (url.includes("restaurant")) {
//     return path.join(__dirname, "../public/upload");
//   }
//   else if (url.includes("workShedule")) {
//     return path.join(__dirname, "../public/upload");
//   }
//   else if (url.includes("admin")) {
//     return path.join(__dirname, "../public/upload");
//   }
//   else if (url.includes("putadminmessages/:_id")) {
//     return path.join(__dirname, "../public/upload");
//   }
//   else if(url.includes("order_sound")){
//     return path.join(__dirname, "../public/ordersound");
//   }
//   else if (url.includes("update-order-sound")) { // ✅ this line is the fix
//     return path.join(__dirname, "../public/ordersound");
//   }
 
  
//   return null; // Default case if no match
// };


// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = getUploadPath(req.originalUrl);
//     if (uploadPath) {
//       if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
//       cb(null, uploadPath);
//     } else {
//       cb(new Error("Invalid upload path"), false);
//     }
//   },
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });

// // File filter for specific mimetypes
// const fileFilter = (req, file, cb) => {
//   const validTypes = ["image/jpeg", "image/jpg", "image/png"];
//   cb(null, validTypes.includes(file.mimetype));
// };

// // Setup multer for image upload
// const uploadimage = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // Max size 50MB
//   fileFilter,
// });

// module.exports = uploadimage;
