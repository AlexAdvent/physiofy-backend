let mongoose = require('mongoose');

let otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
    },
    physioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Physio",
        required: true,
    },
    type: {
        type: String,
        enum: ["register", "login", "forgotPassword",],
        required: true,
    },
    for: {
        type: String,
        enum: ["phone", "email"],
        required: true,
    },
},
    {
        timestamps: true,
    }
);

let Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;