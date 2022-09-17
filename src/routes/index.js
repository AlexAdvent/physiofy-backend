const express = require("express");
const router = express.Router();

module.exports = function (io) {
  router.use("/api", require("./api")(io));
  router.get('/', (req, res) => {res.send("okay")});
  return router;
};  // Compare this snippet from src\routes\api\auth\auth.js: