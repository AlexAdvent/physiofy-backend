const mongoose = require("mongoose");

const physioSchema = new mongoose.Schema(
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
        clinicName: {
            type: String,
        },
        clinicAddress: {
            type: String,
        },
        clinicPhoneNumber: {
            type: Number,
        },
        speciality: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const PhysioProfile = mongoose.model("PhysioProfile", physioSchema);

module.exports = PhysioProfile;