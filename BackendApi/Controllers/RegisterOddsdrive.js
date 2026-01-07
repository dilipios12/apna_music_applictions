// server.js or routes/user.js
const express = require("express");

const User = require("../Models/RegisterSchmaOdds")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretjwt32423qwewewe";

// Register API
exports.handelRegiste = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      address,
      city,
      contact,
      state,
      email,
      password,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !contact ||
      !state ||
      !email ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Get uploaded file paths
    const licenseImage = req.files["licenseImage"]
      ? req.files["licenseImage"][0].filename
      : null;

    const insuranceImage = req.files["insuranceImage"]
      ? req.files["insuranceImage"][0].filename
      : null;
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      address,
      city,
      contact,
      state,
      email,
      password: hashedPassword,
      licenseImage,
      insuranceImage,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.loginUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" } // token expires in 7 days
    );

    // Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


