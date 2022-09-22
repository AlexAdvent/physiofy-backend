const express = require("express");
const router = express.Router();

const { registerGenerateOTP, registerVerifyOTP, registerDtails, login, logout, forgotPasswordGenerateOTP, forgotPasswordVerifyOTP, forgotPasswordResetPassword } = require("../../../controllers/auth/physio");
const physioVerifyToken = require("../../../middleware/physio-auth");

router.post("/register/generateotp", registerGenerateOTP);

router.post("/register/verifyotp", registerVerifyOTP);

router.post("/register/details", physioVerifyToken, registerDtails);

router.post("/login", login);

router.post("/logout", physioVerifyToken, logout);

router.post("/forgotpassword/generateotp", forgotPasswordGenerateOTP);

router.post("/forgotpassword/verifyotp", forgotPasswordVerifyOTP);

router.post("/forgotpassword/resetpassword", forgotPasswordResetPassword);

module.exports = router;