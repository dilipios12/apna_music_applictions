const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/mailer');
const twilio = require('twilio');
exports.register = async (req, res) => {
  try {
    
    const { username, email, password, phone_number } = req.body;

    if (!username || !email || !password || !phone_number) {
      return res.status(400).json({ message: "Please fill in all details" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone_number
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//-----------------------------LOGIN THE USER-------------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // ✅ Send email after successful login
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Login Successful",
      text: `Hello ${user.username},\n\nYou have successfully login in.\n\nBest regards,\nTeam`,
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};





//----------------------------SEND THE OTP SERVE---------------------------

require('dotenv').config();  // Make sure this line comes first

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);



exports.sendOTP = async (req, res) => {
  const { phone_number } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpiresAt = new Date(Date.now() + 50 * 1000); // 20 seconds from now

  try {
    // Save OTP to DB with expiry
    await User.findOneAndUpdate(
      { phone_number },
      { otp, otpExpiresAt },
      { upsert: true, new: true }
    );

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone_number}`,
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};









// Mock OTP generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
// In-memory storage (use DB in production)
const otpStore = new Map();
exports.resendotp = async (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Generate new OTP
  const otp = generateOTP();
  otpStore.set(phone_number, otp);

  // Simulate sending OTP (e.g., via SMS)
  console.log(`OTP for ${phone_number}: ${otp}`);

  res.json({ message: 'OTP resent successfully', otp }); // send `otp` only for testing
};




//------------------------Verify OTP//////////////////////
exports.verifyOTP = async (req, res) => {
  const { phone_number, otp } = req.body;

  try {
    const user = await User.findOne({ phone_number });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const now = new Date();

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < now) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    // ✅ OTP Verified
    // Optionally clear the OTP from DB
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




exports.resetPassword = async (req, res) => {
  const { phone_number, newPassword } = req.body;
  const user = await User.findOne({ phone_number });

  if (!user) return res.status(404).json({ message: "User not found" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
  res.json({ message: "Password reset successful" });
};


exports.getdata = async  (req, res)=>{
    res.send(" i ma ready ");
}


