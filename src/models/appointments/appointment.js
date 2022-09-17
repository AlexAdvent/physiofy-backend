const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        physioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Physio",
            required: true,
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed"],
            default: "pending",
        },
        isCancelled: {
            type: Boolean,
            default: false,
        },
        isRescheduled: {
            type: Boolean,
            default: false,
        },
        rescheduledTo: {
            type: Date,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        isMissed: {
            type: Boolean,
            default: false,
        },
        isCancelledByPatient: {
            type: Boolean,
            default: false,
        },
        isCancelledByPhysio: {
            type: Boolean,
            default: false,
        },
        
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;