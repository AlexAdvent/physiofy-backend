const createError = require("http-errors");
const mongoose = require("mongoose");

const PhysioProfile = require("../../../models/user-management/physio-profile");


module.exports = {
    updateProfileAll: async (req, res, next) => {
        try {
            
            const { firstName, lastName, speciality, clinicName, clinicAddressFlat, clinicAddressApartment, clinicAddressPincode, clinicAddressCity, clinicAddressState, clinicPhoneNumber } = req.body;

            // check null firstName
            if (!firstName) {
                return res.status(400).json({
                    error: "First Name is required",
                    field: "firstName",
                });
            }

            // check null lastName
            if (!lastName) {
                return res.status(400).json({
                    error: "Last Name is required",
                    field: "lastName",
                });
            }

            // check null speciality
            if (!speciality) {
                return res.status(400).json({
                    error: "Speciality is required",
                    field: "speciality",
                });
            }

            // check null clinicName
            if (!clinicName) {
                return res.status(400).json({
                    error: "Clinic Name is required",
                    field: "clinicName",
                });
            }

            // check null clinicAddressFlat
            if (!clinicAddressFlat) {
                return res.status(400).json({
                    error: "Clinic Address Flat is required",
                    field: "clinicAddressFlat",
                });
            }

            // check null clinicAddressApartment
            if (!clinicAddressApartment) {
                return res.status(400).json({
                    error: "Clinic Address Apartment is required",
                    field: "clinicAddressApartment",
                });
            }

            // check null clinicAddressPincode
            if (!clinicAddressPincode) {
                return res.status(400).json({
                    error: "Clinic Address Pincode is required",
                    field: "clinicAddressPincode",
                });
            }

            // check null clinicAddressCity
            if (!clinicAddressCity) {
                return res.status(400).json({
                    error: "Clinic Address City is required",
                    field: "clinicAddressCity",
                });
            }

            // check null clinicAddressState
            if (!clinicAddressState) {
                return res.status(400).json({
                    error: "Clinic Address State is required",
                    field: "clinicAddressState",
                });
            }

            // check null clinicPhoneNumber
            if (!clinicPhoneNumber) {
                return res.status(400).json({
                    error: "Clinic Phone Number is required",
                    field: "clinicPhoneNumber",
                });
            }

            // validate pincode and check length
            if (isNaN(clinicAddressPincode) || clinicAddressPincode.toString().length !== 6) {
                return res.status(400).json({
                    error: "Clinic Address Pincode is invalid",
                    field: "clinicAddressPincode",
                });
            }

            // validate phone number
            if (isNaN(clinicPhoneNumber)) {
                return res.status(400).json({
                    error: "Clinic Phone Number must be a number",
                    field: "clinicPhoneNumber",
                });
            }

            const id = req.physio._id;

            // if physioProfile not found then create new physioProfile
            const physioProfile = await PhysioProfile.findOne({ physioId: id });
            if (!physioProfile) {
                const newPhysioProfile = new PhysioProfile({
                    physioId: id,
                    firstName,
                    lastName,
                    speciality,
                    clinicName,
                    clinicAddressFlat,
                    clinicAddressApartment,
                    clinicAddressPincode,
                    clinicAddressCity,
                    clinicAddressState,
                    clinicPhoneNumber
                });
                await newPhysioProfile.save();
                return res.status(201).json({
                    message: "Physio Profile Created Successfully"
                });
            }

            // if physioProfile found then update physioProfile
            physioProfile.firstName = firstName;
            physioProfile.lastName = lastName;
            physioProfile.speciality = speciality;
            physioProfile.clinicName = clinicName;
            physioProfile.clinicAddressFlat = clinicAddressFlat;
            physioProfile.clinicAddressApartment = clinicAddressApartment;
            physioProfile.clinicAddressPincode = clinicAddressPincode;
            physioProfile.clinicAddressCity = clinicAddressCity;
            physioProfile.clinicAddressState = clinicAddressState;
            physioProfile.clinicPhoneNumber = clinicPhoneNumber;
            await physioProfile.save();
            return res.status(200).json({
                message: "Physio Profile Updated Successfully"
            });
        } catch (error) {
            console.log("error", error);
            return next({ message: "internal server error", status: 500 });
        }
    },

    // update only fields which are passed in request body
    updateProfileSpecific: async (req, res, next) => {
        try {
            const id = req.physio._id;
            const physioProfile = await PhysioProfile.findOne({ physio: id });
            if (!physioProfile) {
                return res.status(404).json({
                    message: "Physio Profile Not Found"
                });
            }
            const { firstName, lastName, speciality, clinicName, clinicAddressFlat, clinicAddressApartment, clinicAddressPincode, clinicAddressCity, clinicAddressState, clinicPhoneNumber } = req.body;
            if (firstName) {
                physioProfile.firstName = firstName;
            }
            if (lastName) {
                physioProfile.lastName = lastName;
            }
            if (speciality) {
                physioProfile.speciality = speciality;
            }
            if (clinicName) {
                physioProfile.clinicName = clinicName;
            }
            if (clinicAddressFlat) {
                physioProfile.clinicAddressFlat = clinicAddressFlat;
            }
            if (clinicAddressApartment) {
                physioProfile.clinicAddressApartment = clinicAddressApartment;
            }
            if (clinicAddressPincode) {

                // validate pincode and check length
                if (isNaN(clinicAddressPincode) || clinicAddressPincode.toString().length !== 6) {
                    return res.status(400).json({
                        message: "Clinic Address Pincode is invalid"
                    });
                }

                physioProfile.clinicAddressPincode = clinicAddressPincode;
            }
            if (clinicAddressCity) {
                physioProfile.clinicAddressCity = clinicAddressCity;
            }
            if (clinicAddressState) {
                physioProfile.clinicAddressState = clinicAddressState;
            }
            if (clinicPhoneNumber) {

                // validate phone number
                if (isNaN(clinicPhoneNumber)) {
                    return res.status(400).json({
                        message: "Clinic Phone Number must be a number"
                    });
                }
                
                physioProfile.clinicPhoneNumber = clinicPhoneNumber;
            }
            await physioProfile.save();
            return res.status(200).json({
                message: "Physio Profile Updated Successfully"
            });
        } catch (error) {
            console.log("error", error);
            return next({ message: "internal server error", status: 500 });
        }
    },

    getProfile: async (req, res, next) => {

        try {
            const id = req.physio._id;
            const physioProfile = await PhysioProfile.findOne({ physio: id });
            if (!physioProfile) {
                return res.status(404).json({
                    message: "Physio Profile Not Found"
                });
            }
            return res.status(200).json({
                message: "Physio Profile Fetched Successfully",
                physioProfile
            });
        } catch (error) {
            console.log("error", error);
            return next({ message: "internal server error", status: 500 });
        }
    },
};