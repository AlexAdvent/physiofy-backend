const express = require("express");
const router = express.Router();

module.exports = function () {
  router.use("/auth", require("./auth")());
  return router;
};
