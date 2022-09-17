const express = require("express");
const router = express.Router();

const { registerGenerateOTP } = require("../../controllers/auth/physio");

router.post("/register/generateotp", registerGenerateOTP);

// router.post("/login", login);

// router.post("/logout", logout);

module.exports = router;