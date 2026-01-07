const express = require('express');
const router = express.Router();
const { register, login, getdata,sendOTP,verifyOTP,resetPassword,resendotp} = require('../Controllers/authController');
const {handelRegiste,loginUsers} =require('../Controllers/RegisterOddsdrive');
const {playlists ,playlistType,handelGetdata,handelGetAllData,handelGetOneby,searchPlaylists} = require("../Controllers/palylist");
const uploadimage =require("../multer/fileUpload");
const authMiddleware = require('../middleware/authMiddleware');
const {regsiter,loginpalylist,hendealsendOTP,hendealsendOTPIEmail,verifyEmailOTP,resendEmailotp,resetPasswordsong} =require('../Controllers/playlistRegister');
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendotp);
router.post('/reset-password', resetPassword);
router.get("/get",getdata);
// router.post(
//   "/registeroddsdrive",
//   uploadimage.fields([
//     { name: "licenseImage", maxCount: 1 },
//     { name: "insuranceImage", maxCount: 1 },
//   ]),
//   handelRegiste
// );



const { saveFavorite, getFavorites } = require("../Controllers/favoriteController");

router.post("/saveFavorite", saveFavorite); // POST → add/remove favorite
router.get("/getFavorites", getFavorites);   // GET → fetch all favorites
router.post("/playlists", uploadimage(), playlists);
router.get("/search-playlists", searchPlaylists);
router.post("/regsiter-users",regsiter);
router.post("/platlist-type",playlistType);
router.post("/getAllData",handelGetdata);
router.get("/get-all-playlistdata",handelGetOneby);
router.get("/all-playlistdata",handelGetAllData);
router.post('/loginUsers', loginUsers);
router.post("/loginusers-palylist",loginpalylist);
router.post("/send-otp",hendealsendOTP);
router.post("/sendtheotp",hendealsendOTPIEmail);
router.post("/verify-emailOTP",verifyEmailOTP);
router.post("/resend-otp-email",resendEmailotp);
router.post("/reset-password-song",resetPasswordsong);

// Protected route example
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: "Access granted", userId: req.user });
});
module.exports = router;


