const express = require("express");
const router = express.Router();

module.exports = function () {
  router.use("/auth", require("./auth")());
  router.use("/usermanagement", require("./user-management")());
  return router;
};