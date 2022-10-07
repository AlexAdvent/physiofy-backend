const express = require("express");
const router = express.Router();

module.exports = function () {
  router.use("/auth", require("./auth")());
  router.use("/usermanagement", require("./user-management")());
  router.use("/membership", require("./membership")());
  router.use("/exercises", require("./exercises")());
  router.use("/patients", require("./patients")());
  return router;
};