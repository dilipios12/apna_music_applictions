// playlistRegister
const express = require("express");
const playlistUsers = require("../Models/playlistRegister")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require('../utils/mailer');

const JWT_SECRET = "supersecretjwt32423qwewewe";
const twilio = require('twilio');

exports.regsiter = async (req, res) => {
  try {

    const { username, email, password, phone_number } = req.body;

    if (!username || !email || !password || !phone_number) {
      return res.status(400).json({ message: "Please fill in all details" });
    }

    const existUser = await playlistUsers.findOne({ email });
    if (existUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new playlistUsers({
      username,
      email,
      password: hashedPassword,
      phone_number
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      data: newUser
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



exports.loginpalylist = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await playlistUsers.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // ✅ Send email after successful login
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "🎵 Login Successful — Welcome Back!",
      text: `
Hello ${user.username}, 🎧
You’re now logged in to your Music App.
Enjoy your music journey!
🎶 - Music App Team
  `.trim(),
    });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//-----SEND THE OTP IN EMAIL ID -------------------
exports.hendealsendOTPIEmail = async (req, res) => {
  const { email } = req.body;


  const user = await playlistUsers.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 50 * 1000); // 50 seconds

    // Save OTP into DB
    await playlistUsers.findOneAndUpdate(
      { email },
      { otp, otpExpiresAt },
      { upsert: true, new: true }
    );

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 50 seconds.`,
    });

    console.log("OTP Email Sent Successfully");

    return res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("Email OTP Error:", err);

    return res.status(500).json({
      error: "Failed to send OTP",
      details: err.message,
    });
  }
};
// authverifyMobileOTP

// -------- VERIFY EMAIL OTP --------
exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await playlistUsers.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check OTP expiration
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    // Check OTP match
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP is correct → clear OTP
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error("OTP Verification Error:", err);

    return res.status(500).json({
      error: "Failed to verify OTP",
      details: err.message,
    });
  }
};


exports.resendEmailotp = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate OTP
    const otp = generateOTP();
    const expirySeconds = 50;
    const otpExpiresAt = new Date(Date.now() + expirySeconds * 1000);

    // Save OTP to DB
    await playlistUsers.findOneAndUpdate(
      { email },
      { otp, otpExpiresAt },
      { upsert: true, new: true }
    );
    // Email message text
    const messageText = `
Your OTP is: ${otp} This OTP will expire in: ${expirySeconds} seconds.
Expiry Time: ${otpExpiresAt.toLocaleTimeString()}
    `.trim();
    // Send Email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Resend OTP Code",
      text: messageText,
    });

    return res.json({ message: "Email OTP resent successfully" });

  } catch (error) {
    console.error("Resend Email OTP Error:", error);

    return res.status(500).json({
      message: "Failed to resend email OTP",
      error: error.message,
    });
  }
};


exports.resetPasswordsong = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await playlistUsers.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
  res.json({ message: "Password reset successful" });
};


require('dotenv').config();  // Make sure this line comes first

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


//-------------------------SEND THE OTP IN PHONE NUMBER-----------------

exports.hendealsendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpiresAt = new Date(Date.now() + 50 * 1000); // 50 seconds

  try {
    // Save OTP to DB with expiry
    await playlistUsers.findOneAndUpdate(
      { phone_number },
      { otp, otpExpiresAt },
      { upsert: true, new: true }
    );

    // Send OTP
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone_number}`,
    });
    console.log("OTP Sent Successfully:", message.sid);
    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Twilio Full Error:", err.message, err.code, err.moreInfo);

    return res.status(500).json({
      error: "Failed to send OTP",
      details: err.message,
    });
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
