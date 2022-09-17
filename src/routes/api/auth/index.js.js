const express = require("express");
const router = express.Router();

module.exports = function (io) {
  router.use("/physio", require("./physio")());
  return router;
};
