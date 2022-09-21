const jwt = require("jsonwebtoken");

// import dependency
const config = require("../../config");
const Physio = require('../models/user-management/physio');

const physioVerifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({error:"A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // console.log("decoded", decoded);

    Physio.findOne({_id: decoded.id}, (err, user) => {
      if (err) {
          return res.status(403).send({error:"Server error"});
      }
      console.log("user", user);
      if (!user) {
          return res.status(403).send({error:"user not found"});
      }
      // check if token is in user token list
      if (!user.tokenList.includes(token)) {
          return res.status(403).send({error:"invalid token"});
      }

      req.physio = user;
      next();
    });
  } catch (err) {
    console.log("err", err);
    return res.status(401).send({error:"Invalid Token"});
  }
};

module.exports = physioVerifyToken;