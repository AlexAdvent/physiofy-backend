const express = require("express");
const router = express.Router();

module.exports = function () {
  router.use("/physioprofile", require("./physio-profile"));
  return router;
};