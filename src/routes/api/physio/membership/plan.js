const express = require("express");
const router = express.Router();

const { createPlan, getPlan, updatePlan, deletePlan } = require("../../../../controllers/physio/membership/plan");
const physioVerifyToken = require("../../../../middleware/physio-auth");


router.post("/createplan", physioVerifyToken, createPlan);
router.get("/getplan", physioVerifyToken, getPlan);
router.put("/updateplan", physioVerifyToken, updatePlan);
router.delete("/deleteplan", physioVerifyToken, deletePlan);

module.exports = router;