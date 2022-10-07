const express = require("express");
const router = express.Router();

const { addPatient, getPatients, getPatient, updatePatient, deletePatient } = require("../../../../controllers/physio/patients/patient");
const physioVerifyToken = require("../../../../middleware/physio-auth");


router.post("/", physioVerifyToken, addPatient);
router.get("/all", physioVerifyToken, getPatients);
router.get("/", physioVerifyToken, getPatient);
router.put("/", physioVerifyToken, updatePatient);
router.delete("/", physioVerifyToken, deletePatient);

module.exports = router;