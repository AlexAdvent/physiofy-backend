const createError = require("http-errors");
const mongoose = require("mongoose");

const Patient = require('../user-management/patient');

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




            

        

