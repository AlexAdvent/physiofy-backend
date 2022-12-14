const express = require("express");
const router = express.Router();

module.exports = function () {
  router.use("/physio", require("./physio")());
  router.use("/patient", require("./patient")());
  return router;
};