const createError = require("http-errors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Patient = require('../../../models/user-management/patient');


module.exports = {
    login: async (req, res) => {
        try {
            const { loginCode } = req.body;

            // check login code
            if(!loginCode) {
                return res.status(400).json({
                    success: false,
                    message: "Login code is required",
                    field: "loginCode"
                });
            }

            const patient = await Patient.findOne({ loginCode });

            if (!patient) {
                return res.status(400).json({ message: 'Patient not found' });
            }

            // check if patient is blocked
            if (patient.isBlocked) {
                return res.status(400).json({
                    success: false,
                    message: "Patient is blocked",
                });
            }   
            
            // generate token
            let token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

            // add token in token_list in db
            await Patient.updateOne({ _id: patient._id }, { $push: { tokenList: token } });

            // send token
            return res.status(200).send({ token: token });



        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
};