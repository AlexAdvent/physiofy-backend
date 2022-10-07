const express = require("express");
const router = express.Router();

module.exports = function () {
  router.use("/patientprofile", require("./patient-profile"));
  return router;
};