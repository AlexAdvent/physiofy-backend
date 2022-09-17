var mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    physioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physio",
      required: true,
    },
    name: {
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
    },
    address: {
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

const Membership = mongoose.model("Plan", planSchema);
module.exports = Item;
