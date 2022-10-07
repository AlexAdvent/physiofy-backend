const express = require("express");
const router = express.Router();

module.exports = function () {
  router.use("/plan", require("./plan"));
  router.use("/userplan", require("./user-plan"));
  return router;
};
