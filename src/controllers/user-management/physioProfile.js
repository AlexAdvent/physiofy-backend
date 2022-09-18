const createError = require("http-errors");
const mongoose = require("mongoose");

const PhysioProfile = require('../user-management/physioProfile');

module.exports = {
    updateProfile: async (req, res, next) => {
        try {
            
            const { firstName, lastName, clinicName, clinicAddress, clinicPhoneNumber, speciality } = req.body;
            const { userId } = req.params;

            if (!firstName || !lastName || !clinicName || !clinicAddress || !clinicPhoneNumber || !speciality) {
                return next(createError(400, "All fields are required"));
            }

            const physioProfile = await PhysioProfile.findOne({ physioId: userId });

            if (!physioProfile) {
                return next(createError(400, "Physio profile not found"));
            }

            physioProfile.firstName = firstName;
            physioProfile.lastName = lastName;
            physioProfile.clinicName = clinicName;
            physioProfile.clinicAddress = clinicAddress;
            physioProfile.clinicPhoneNumber = clinicPhoneNumber;
            physioProfile.speciality = speciality;

            await physioProfile.save();

            return res.status(200).json({
                status: "success",
                message: "Physio profile updated successfully",
                data: physioProfile,
            });

        } catch (error) {
            next(error);
        }
    }
};