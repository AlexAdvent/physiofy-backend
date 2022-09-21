const createError = require("http-errors");
const mongoose = require("mongoose");

const Patient = require('../user-management/patient');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    addPatient: async (req, res, next) => {
        try {
            const { 
                firstName, 
                lastName, 
                phoneNumber,
                email,
                address,
                problems,
                exceriseList
            } = req.body;


            //  check first name is not empty
            if (!firstName) {
                return next(createError(400, "First name is required"));
            }

            //  check last name is not empty
            if (!lastName) {
                return next(createError(400, "Last name is required"));
            }

            // check problems is array of strings
            if (!problems || !Array.isArray(problems) || problems.some(problem => typeof problem !== "string")) {
                return next(createError(400, "Problems is required and should be an array of strings"));
            }

            // check exceriseList is array of mogodb ids
            if (!exceriseList || !Array.isArray(exceriseList) || exceriseList.some(excerise => !ObjectId.isValid(excerise))) {
                return next(createError(400, "Excerise list is required and should be an array of mogodb ids"));
            }

            // generate patientcode
            const patientCode = Math.floor(100000 + Math.random() * 900000);

            // create patient
            const newPatient = new Patient({
                firstName,
                lastName,
                phoneNumber,
                email,
                address,
                problems,
                patientCode,
                exceriseList
            });

            await newPatient.save();

            return res.status(200).json({
                status: "success",
                message: "Patient added successfully",
                data: {
                    patientCode
                }
            });

        } catch (error) {
            next(error);
        }

    }

}




            

        

