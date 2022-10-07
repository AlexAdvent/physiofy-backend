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
        speciality: {
            type: String,
        },
        clinicName: {
            type: String,
        },
        clinicAddressFlat: {
            type: String,
        },
        clinicAddressApartment: {
            type: String,
        },
        clinicAddressPincode: {
            type: Number,
        },
        clinicAddressCity: {
            type: String,
        },
        clinicAddressState: {
            type: String,
        },
        clinicPhoneNumber: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const PhysioProfile = mongoose.model("PhysioProfile", physioSchema);

module.exports = PhysioProfile;