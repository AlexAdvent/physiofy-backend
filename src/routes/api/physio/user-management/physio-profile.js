const express = require("express");
const router = express.Router();

const { updateProfileAll, updateProfileSpecific, getProfile } = require("../../../../controllers/physio/user-management/physio-profile");
const physioVerifyToken = require("../../../../middleware/physio-auth");

router.put("/updateprofileall", physioVerifyToken, updateProfileAll);
router.put("/updateprofilespecific", physioVerifyToken, updateProfileSpecific);
router.get("/getprofile", physioVerifyToken, getProfile);



module.exports = router;