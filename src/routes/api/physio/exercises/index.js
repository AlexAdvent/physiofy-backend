const express = require("express");
const router = express.Router();

module.exports = function () {
  router.use("/category", require("./category"));
  router.use("/exercise", require("./exercise"));
  return router;
};
