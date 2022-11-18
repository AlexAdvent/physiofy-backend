const express = require("express");
const router = express.Router();

const { getProfile, updatePatient, getExercises } = require("../../../../controllers/patient/user-management/patient-profile");
const patientVerifyToken = require("../../../../middleware/patient-auth");

// router.put("/updateprofileall", physioVerifyToken, updateProfileAll);
// router.put("/updateprofilespecific", physioVerifyToken, updateProfileSpecific);
router.get("/getprofile", patientVerifyToken, getProfile);
router.put("/updateprofile", patientVerifyToken, updatePatient);
router.get("/getexercises", patientVerifyToken, getExercises);


module.exports = router;