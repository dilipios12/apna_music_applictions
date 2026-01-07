const mongoose = require("mongoose");

const userRegisterSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  contact: { type: Number, required: true },
  state: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  licenseImage: { type: String }, // store as URL or Base64
  insuranceImage: { type: String }, // store as URL or Base64
});

module.exports = mongoose.model("OddsdriveRegister", userRegisterSchema);


