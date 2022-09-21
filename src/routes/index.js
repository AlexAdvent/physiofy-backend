const express = require("express");
const router = express.Router();

module.exports = function () {
  router.use("/api", require("./api")());
  router.get('/', (req, res) => {res.send("okay")});
  return router;
};