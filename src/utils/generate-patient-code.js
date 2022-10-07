const Patient = require("../models/user-management/patient");

let PatientCode = (length) =>{
    // Declare a digits variable
    // which stores all digits
    var digits = "0123456789acdefghijklmnopqrstuvwxyz";
    var Code = "";
    for (var i = 0; i < length; i++) {
        Code += digits[Math.floor(Math.random() * digits.length)];
    }
    // OTP = '0000';
    return Code;
}

let generatePatientCode = async () => {

    // generate patientcode and check if it is unique
    let loginCode = PatientCode(8);
    console.log('patientCode', loginCode);
    let isUnique = false;
    let repeat = 0;
    while (!isUnique) {
        const patient = await Patient.findOne({ loginCode });
        console.log('patient', patient);
        // if repeat more than 10 times, return error
        if (repeat > 10) {
           throw new Error("Can't generate unique patient code"); 
        }
        if (patient) {
            loginCode = PatientCode(8);
            repeat++;
        } else {
            isUnique = true;
        }
    }

    return loginCode;

}

module.exports = generatePatientCode;
