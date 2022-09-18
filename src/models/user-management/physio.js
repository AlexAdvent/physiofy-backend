const mongoose = require("mongoose");

const physioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
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