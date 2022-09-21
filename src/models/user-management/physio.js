const mongoose = require("mongoose");

const physioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
      sparse: true,
    },
    tokenList: [
      {
        type: String,
      },
    ],
    verifyEmail: {
      type: Boolean,
      default: false,
    },
    verifyPhone: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Physio = mongoose.model("Physio", physioSchema);

module.exports = Physio;