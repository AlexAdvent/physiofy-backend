var mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    physioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physio",
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    email: {
      type: String,
    },
    loginCode: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    problems: [
      {
        type: String,
      },
    ],
    tokenList: [
      {
        type: String,
      },
    ],
    exceriseList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Excerise",
      },
    ],
    appointmentList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
