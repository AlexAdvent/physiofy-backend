const express = require("express");
const router = express.Router();

const { registerGenerateOTP, registerVerifyOTP, registerDetails, login, logout, forgotPasswordGenerateOTP, forgotPasswordVerifyOTP, forgotPasswordResetPassword } = require("../../../../controllers/physio/auth/physio");
const physioVerifyToken = require("../../../../middleware/physio-auth");

router.post("/register/generateotp", registerGenerateOTP);

router.post("/register/verifyotp", registerVerifyOTP);

router.post("/register/details", physioVerifyToken, registerDetails);

router.post("/login", login);

router.post("/logout", physioVerifyToken, logout);

router.post("/forgotpassword/generateotp", forgotPasswordGenerateOTP);

router.post("/forgotpassword/verifyotp", forgotPasswordVerifyOTP);

router.post("/forgotpassword/resetpassword", forgotPasswordResetPassword);

module.exports = router;