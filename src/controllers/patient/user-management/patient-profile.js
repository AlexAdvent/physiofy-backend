const { request } = require("express");
const mongoose = require("mongoose");

const Patient = require("../../../models/user-management/patient");
const ObjectId = mongoose.Types.ObjectId;

const generatePatientCode =  require("../../../utils/generate-patient-code");

module.exports = {
    getProfile : async (req, res, next) => {
        try {

            let patientId = req.patient._id; 
            
            const patient = await Patient.findOne({_id : patientId});
            return res.status(200).json({
                status: "success",
                message: "Patient fetched successfully",
                data: {
                    patient
                }
            });
        } catch (err) {
            console.log("err", err);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    },
    
    updatePatient : async (req, res, next) => {
        try {
            const patientId = req.patient._id; 
            const { firstName, lastName, phoneNumber, email, address, pincode, city, state, country, problems } = req.body;

            let physioId = req.patient._id; 

            // check if patient exists
            const patient = await Patient.findOne({ _id : patientId });

            if (!patient) {
                return res.status(400).json({
                    status: "error",
                    message: "Patient not found",
                });
            }

            // if details exist update them
            if (firstName) {
                patient.firstName = firstName;
            }

            if (lastName) {
                patient.lastName = lastName;
            }

            if (phoneNumber) {
                // check is nan
                if (isNaN(phoneNumber)) {
                    return res.status(400).json({
                        status: "error",
                        message: "Phone number should be a number",
                    });
                }

                patient.phoneNumber = phoneNumber;
            }

            if (email) {
                // check email is valid regex
                const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        status: "error",
                        message: "Email is invalid",
                    });
                }
                patient.email = email;
            }

            if (address) {
                patient.address = address;
            }

            if (pincode) {
                // check is nan
                if (isNaN(pincode)) {
                    return res.status(400).json({
                        status: "error",
                        message: "Pincode should be a number",
                    });
                }
                patient.pincode = pincode;
            }

            if (city) {
                patient.city = city;
            }

            if (state) {
                patient.state = state;
            }

            if (country) {
                patient.country = country;
            }

            if (problems) {
                // check problems is array of strings
                if (!Array.isArray(problems) || problems.some(problem => typeof problem !== "string")) {
                    return res.status(400).json({
                        status: "error",
                        message: "Problems should be an array of strings",
                    });
                }
                patient.problems = problems;
            }

            await patient.save();

            return res.status(200).json({
                status: "success",
                message: "Patient updated successfully",
            });
        } catch (err) {
            console.log("err", err);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    },
};