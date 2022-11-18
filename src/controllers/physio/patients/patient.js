const { request } = require("express");
const mongoose = require("mongoose");

const Patient = require("../../../models/user-management/patient");
const ObjectId = mongoose.Types.ObjectId;
const Exercise = require("../../../models/exercises/exercise");

const generatePatientCode =  require("../../../utils/generate-patient-code");

module.exports = {

    addPatient: async (req, res, next) => {
        try {
            const { firstName, lastName, phoneNumber, email, address, pincode, city, state, country, problems } = req.body;

            let physioId = req.physio._id;



            if (!firstName) {
                return res.status(400).json({
                    status: "error",
                    message: "First name is required",
                });
            }

            if (!lastName) {
                return res.status(400).json({
                    status: "error",
                    message: "Last name is required",
                });
            }

            if (!phoneNumber) {
                return res.status(400).json({
                    status: "error",
                    message: "Phone number is required",
                });
            }

            // if (!email) {
            //     return res.status(400).json({
            //         status: "error",
            //         message: "Email is required",
            //     });
            // }

            if (!address) {
                return res.status(400).json({
                    status: "error",
                    message: "Address is required",
                });
            }


            if (!pincode) {
                return res.status(400).json({
                    status: "error",
                    message: "Pincode is required",
                });
            }

            if (!city) {
                return res.status(400).json({
                    status: "error",
                    message: "City is required",
                });
            }

            if (!state) {
                return res.status(400).json({
                    status: "error",
                    message: "State is required",
                });
            }

            if (!country) {
                return res.status(400).json({
                    status: "error",
                    message: "Country is required",
                });
            }

            if (!problems) {
                return res.status(400).json({
                    status: "error",
                    message: "Problems is required",
                });
            }


            // checkphoneNumber is NAN
            if (isNaN(phoneNumber)) {
                return res.status(400).json({
                    status: "error",
                    message: "Phone number should be a number",
                });
            }

            // check pincode is NAN
            if (isNaN(pincode)) {
                return res.status(400).json({
                    status: "error",
                    message: "Pincode should be a number",
                });
            }

            // check email is valid regex if provided
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (email && !emailRegex.test(email)) {
                return res.status(400).json({
                    status: "error",
                    message: "Email is invalid",
                });
            }

            // check problems is array of strings
            if (!Array.isArray(problems) || problems.some(problem => typeof problem !== "string")) {
                return res.status(400).json({
                    status: "error",
                    message: "Problems should be an array of strings",
                });
            }

            // generate patientcode
            const loginCode = await generatePatientCode();

            // create patient
            const newPatient = new Patient({
                physioId,
                firstName,
                lastName,
                phoneNumber,
                email,
                address,
                pincode,
                city,
                state,
                country,
                problems,
                loginCode,
            });

            await newPatient.save()
            return res.status(200).json({
                status: "success",
                message: "Patient added successfully",
                data: {
                    loginCode
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

    getPatients : async (req, res, next) => {
        try {
            const patients = await Patient.find({physioId : req.physio._id});
            return res.status(200).json({
                status: "success",
                message: "Patients fetched successfully",
                data: {
                    patients
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

    getPatient : async (req, res, next) => {
        try {
            const patientId = req.query.patientId;

            // check patientId is valid ObjectId
            if (!patientId || !ObjectId.isValid(patientId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Patient id is invalid",
                    field: "patientId",
                });
            }
            const patient = await Patient.findOne({_id : patientId, physioId : req.physio._id});
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
            const patientId = req.query.patientId;
            const { firstName, lastName, phoneNumber, email, address, pincode, city, state, country, problems } = req.body;

            let physioId = req.physio._id;

            // check patientId is valid ObjectId
            if (!patientId || !ObjectId.isValid(patientId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Patient id is invalid",
                    field: "patientId",
                });
            }

            // check if patient exists
            const patient = await Patient.findOne({_id : patientId, physioId : req.physio._id});

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

    deletePatient : async (req, res, next) => {
        try {
            const patientId = req.query.patientId;
            const patient = await Patient.findOne({_id : patientId, physioId : req.physio._id});

            if (!patient) {
                return res.status(400).json({
                    status: "error",
                    message: "Patient not found",
                });
            }

            await patient.remove();

            return res.status(200).json({
                status: "success",
                message: "Patient deleted successfully",
            });
        } catch (err) {
            console.log("err", err);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    },

    // update excerise for patient
    updateExcerise : async (req, res, next) => {
        try {
            const { excerise } = req.body;

            const patientId = req.query.patientId;
            const patient = await Patient.findOne({_id : patientId});
            console.log("patient", patient, patientId, req.physio._id);

            if (!patient) {
                return res.status(400).json({
                    status: "error",
                    message: "Patient not found",
                });
            }

            // check excerise is array of mongoIds
            if (!Array.isArray(excerise) || excerise.some(exceriseId => !ObjectId.isValid(exceriseId))) {
                return res.status(400).json({
                    status: "error",
                    message: "Excerise should be an array of mongoIds",
                });
            }

            // check if all exceriseIds are valid
            const exceriseIds = await Exercise.find({ _id : { $in : excerise }});
            if (exceriseIds.length !== excerise.length) {
                return res.status(400).json({
                    status: "error",
                    message: "Excerise id is invalid",
                });
            }
            

            patient.exceriseList = excerise;

            await patient.save();

            return res.status(200).json({
                status: "success",
                message: "Excerise updated successfully",
            });
        } catch (err) {
            console.log("err", err);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
    },
}

        // getPatient: function (req, res, next) {
        //     const { patientCode } = req.params;

        //     if (!patientCode) {
        //         return res.status(400).json({
        //             status: "error",
        //             message: "Patient code is required",
        //         });
        //     }

        //     Patient.findOne({ patientCode }).then((data) => {
        //         if (!data) {
        //             return res.status(404).json({
        //                 status: "error",
        //                 message: "Patient not found",
        //             });
        //         }

        //         return res.status(200).json({
        //             status: "success",
        //             message: "Patient fetched successfully",
        //             data,
        //         });
        //     }).catch((err) => {
        //         return res.status(500).json({
        //             status: "error",
        //             message: "Something went wrong",
        //         });
        //     });
        // },

    // });






