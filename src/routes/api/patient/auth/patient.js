const express = require("express");
const router = express.Router();

const { login } = require("../../../../controllers/patient/auth/patient");

router.post("/login", login);

module.exports = router;