const express = require("express");
const router = express.Router();

const { registerGenerateOTP, registerVerifyOTP, registerDtails, login, logout } = require("../../../controllers/auth/physio");
const physioVerifyToken = require("../../../middleware/physio-auth");

router.post("/register/generateotp", registerGenerateOTP);

router.post("/register/verifyotp", registerVerifyOTP);

router.post("/register/details", physioVerifyToken, registerDtails);

router.post("/login", login);

router.post("/logout", physioVerifyToken, logout);

module.exports = router;