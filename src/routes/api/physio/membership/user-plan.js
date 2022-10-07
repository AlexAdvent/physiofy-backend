const express = require("express");
const router = express.Router();

const { addPhysioToPlan, getPhysioPlan } = require("../../../../controllers/physio/membership/user-plan");
const physioVerifyToken = require("../../../../middleware/physio-auth");


router.post("/addphysiotoplan", physioVerifyToken, addPhysioToPlan);
router.get("/getphysioplan", physioVerifyToken, getPhysioPlan);

module.exports = router;