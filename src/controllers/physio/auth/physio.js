const createError = require("http-errors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Physio = require('../../../models/user-management/physio');
const Otp = require('../../../models/auth/otp');
const generate_otp = require('../../../utils/generate_otp');
const config = require("../../../../config");

module.exports = {
  registerGenerateOTP: async (req, res, next) => {
    try {
      let { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res
          .status(400)
          .send({ error: "Phone number is required", field: "phoneNumber" });
      }

      // check length of phone number
      if (phoneNumber.length !== 10) {
        return res.status(400).send({
          error: "Phone number should be 10 digits",
          field: "phoneNumber",
        });
      }

      // //phone regex E.164 format
      // let phoneRegExp = /^\+?[1-9]\d{1,14}$/;
      // if (!phoneRegExp.test(phoneNumber)) {
      //   return res
      //     .status(400)
      //     .send({ error: "Phone number must be E.164 format", field: "phoneNumber" });
      // }

      //check if phone number exist and username is added
      let user = await Physio.findOne({ phoneNumber });
      if (user) {
        if (user.username) {
          return res
            .status(400)
            .send({ error: "Phone number already exist", field: "phoneNumber" });
        }
      }

      //generate otp
      let otp = generate_otp(4);

      //send otp
      let message = `Your OTP for Physio App is ${otp}`;
      // let response = await send_sms(phone, message);

      let savedPhysio;

      // if not user then create new user
      if (!user) {
        let newPhysio = new Physio({
          phoneNumber,
        });

        savedPhysio = await newPhysio.save();
      }else{
        savedPhysio = user;
      }

 

      // let newOtp = new Otp({
      //   otp: otp,
      //   physioId: savedPhysio._id,
      //   type: "register",
      //   for: "phone",
      // });

      // let savedOtp = await newOtp.save();

      // update otp and create if not exist
      let updateOtp = await Otp.findOneAndUpdate(
        { physioId: savedPhysio._id, type: "register", for: "phone" },
        { otp: otp },
        { new: true, upsert: true }
      );

      // send id
      return res.status(200).send({ id: savedPhysio._id });

    } catch (error) {
      console.log(error);
      return next({ message: "internal server error", status: 500 });
    }
  },

  registerVerifyOTP: async (req, res, next) => {
    try {
      let { id, otp } = req.body;

      if (!id) {
        return res
          .status(400)
          .send({ error: "Id is required", field: "id" });
      }

      if (!otp) {
        return res
          .status(400)
          .send({ error: "OTP is required", field: "otp" });
      }

      //check if id is valid
      let isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
        return res
          .status(400)
          .send({ error: "Id is not valid", field: "id" });
      }

      //check if id exists
      let physio = await Physio.findById(id);
      if (!physio) {
        return res
          .status(400)
          .send({ error: "Id does not exist", field: "id" });
      }

      //check if otp is valid
      let isValidOtp = await Otp.findOne({ physioId: id, type: "register", for: "phone" });
      if (!isValidOtp) {
        return res
          .status(400)
          .send({ error: "OTP is not generated", field: "otp" });
      }

      // check otp is match
      if (otp != isValidOtp.otp) {
        return res
          .status(400)
          .send({ error: "OTP deos not valid", field: "otp" });
      }

      //check if isValidOtp is expired using updated at
      let isExpired = isValidOtp.updatedAt.getTime() + 5 * 60 * 1000 < Date.now();
      if (isExpired) {
        return res
          .status(400)
          .send({ error: "OTP is expired", field: "otp" });
      }

      //delete otp
      await Otp.deleteOne({ otp: otp, physioId: id, type: "register", for: "phone" });

      // generate token
      let token = jwt.sign({ id: id, date: Date.now(), }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE_IN,
      });

      // physio save token in token array and verify phone to true
      physio.tokenList = [ token ];
      physio.verifyPhone = true;
      await physio.save();

      //send id
      return res.status(200).send({ token });

    } catch (error) {
      console.log(error);
      return next({ message: "internal server error", status: 500 });
    }
  },

  registerDetails: async (req, res, next) => {
    try {
      let { username, email, password, confirmPassword } = req.body;

      let id = req.physio._id;

      let physio_data = req.physio;

      // check if username, email, password, confirmPassword is empty
      if(physio_data.username || physio_data.email || physio_data.password){
        return res
          .status(400)
          .send({ error: "Details already filled", field: "details" });
      }


      if (!username) {
        return res
          .status(400)
          .send({ error: "username is required", field: "username" });
      }

      // check username regex
      let usernameRegExp = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegExp.test(username)) {
        return res
          .status(400)
          .send({ error: "username must be 3-20 characters long and can only contain letters, numbers and underscore", field: "username" });
      }

      // check if username is already registered
      let isUsername = await Physio.findOne({ username: username });
      if (isUsername) {
        return res
          .status(400)
          .send({ error: "username is already taken", field: "username" });
      }

      if (!email) {
        return res
          .status(400)
          .send({ error: "email is required", field: "email" });
      }

      // check email regex
      let emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegExp.test(email)) {
        return res
          .status(400)
          .send({ error: "email is not valid", field: "email" });
      }

      // check if email is already registered
      let isEmail = await Physio.findOne({ email: email });
      if (isEmail) {
        return res
          .status(400)
          .send({ error: "email is already registered", field: "email" });
      }

      if (!password) {
        return res
          .status(400)
          .send({ error: "password is required", field: "password" });
      }

      // check password regex
      let passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegExp.test(password)) {
        return res
          .status(400)
          .send({ error: "password must be 8 characters long and must contain at least one uppercase letter, one lowercase letter and one number", field: "password" });
      }

      if (!confirmPassword) {
        return res
          .status(400)
          .send({ error: "confirm password is required", field: "confirmPassword" });
      }

      // check if password and confirm password match
      if (password !== confirmPassword) {
        return res
          .status(400)
          .send({ error: "password and confirm password do not match", field: "confirmPassword" });
      }

      // hash password with bcrypt and salt
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);


      // // check if id exists
      // let physio = await Physio.findById(id);
      // if (!physio) {
      //   return res
      //     .status(400)
      //     .send({ error: "id does not exist", field: "id" });
      // }

      // // hash password
      // let hashedPassword = await bcrypt.hash(password, 10);

      // // generate token
      // let token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      // add token in token_list in db
      await Physio.updateOne({ _id: id }, { $set: { username: username, email: email, salt, password: hashedPassword } });

      // response email pending if verify email is false
      if (!req.physio.verifyEmail) {
        return res.status(200).send({ message: "email pending" });
      }

      // response success if verify email is true
      return res.status(200).send({ message: "success" });

    } catch (error) {
      console.log(error);
      return next({ message: "internal server error", status: 500 });
    }
  },

  login: async (req, res, next) => {
    try {
      let { username, password } = req.body;

      if (!username) {
        return res
          .status(400)
          .send({ error: "username is required", field: "username" });
      }

      if (!password) {
        return res
          .status(400)
          .send({ error: "password is required", field: "password" });
      }

      // check if username exists
      let physio = await Physio.findOne({ username: username });
      if (!physio) {
        return res
          .status(400)
          .send({ error: "username does not exist", field: "username" });
      }

      // check if password is correct
      let isPassword = await bcrypt.compare(password, physio.password);
      if (!isPassword) {
        return res
          .status(400)
          .send({ error: "password is incorrect", field: "password" });
      }

      // check blocked
      if (physio.isBlocked) {
        return res
          .status(400)
          .send({ error: "account is blocked", field: "blocked" });
      }

      // generate token
      let token = jwt.sign({ id: physio._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      // add token in token_list in db
      await Physio.updateOne({ _id: physio._id }, { $push: { tokenList: token } });

      // send token
      return res.status(200).send({ token: token });

    } catch (error) {
      console.log(error);
      return next({ message: "internal server error", status: 500 });
    }
  },

  logout: async (req, res, next) => {
    try {
      let id = req.physio._id;

      const token = req.body.token || req.query.token || req.headers["x-access-token"];

      // remove token from token_list in db
      await Physio.updateOne({ _id: id }, { $pull: { tokenList: token } });

      // send success message
      return res.status(200).send({ message: "logout successful" });

    } catch (error) {
      console.log(error);
      return next({ message: "internal server error", status: 500 });
    }
  },

  // forgot password
  forgotPasswordGenerateOTP: async (req, res, next) => {
    try {
      let { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res
          .status(400)
          .send({ error: "phoneNumber is required", field: "phoneNumber" });
      }

      // check if email or phone exists
      let physio = await Physio.findOne({ phoneNumber: phoneNumber });
      if (!physio) {
        return res
          .status(400)
          .send({ error: "phoneNumber does not exist", field: "phoneNumber" });
      }
      console.log("physio", physio);

      // check username empty
      if (!physio.username) {
        return res
          .status(400)
          .send({ error: "registration not completed, registered with this number", field: "username" });
      }
      
     

      //generate otp
      let otp = generate_otp(4);

      // send otp to email or phone
      // if (physio.email) {
      //   // send otp to email
      //   let transporter = nodemailer.createTransport({
      //     service: "gmail",
      //     auth: {
      //       user: process.env.EMAIL,
      //       pass: process.env.PASSWORD
      //     }
      //   });

      //   let mailOptions = {
      //     from: process.env.EMAIL,
      //     to: physio.email,
      //     subject: "Forgot Password",
      //     text: `Your OTP is ${otp}`
      //   };

      //   transporter.sendMail(mailOptions, (error, info) => {
      //     if (error) {
      //       console.log(error);
      //       return next("internal server error");
      //     } else {
      //       console.log("Email sent: " + info.response);
      //     }
      //   });
      // }

      // if (physio.phone) {
      //   // send otp to phone

      // }

      // save otp in db
      // let newOtp = new Otp({
      //   otp: otp,
      //   physioId: physio._id,
      //   type: "forgotPassword",
      //   for: "phone",
      // });
      // update otp in db if already exists for this physio
      let newOtp = await Otp.findOneAndUpdate({ physioId: physio._id, type: "forgotPassword", for: "phoneEmail" }, { otp: otp }, { new: true, upsert: true });

      // send username and id
      return res.status(200).send({ username: physio.username, id: physio._id });

    } catch (error) {
      console.log(error);
      return next({ message: "internal server error", status: 500 });
    }
  },

  // forgot password verify otp
  forgotPasswordVerifyOTP: async (req, res, next) => {
    try {
      let { id, otp } = req.body;

      if (!id) {
        return res
          .status(400)
          .send({ error: "id is required", field: "id" });
      }

      if (!otp) {
        return res
          .status(400)
          .send({ error: "otp is required", field: "otp" });
      }

      // check if otp exists
      let otpChecked = await Otp.findOne({ physioId: id, type: "forgotPassword", for: "phoneEmail" });
      if (!otpChecked) {
        return res
          .status(400)
          .send({ error: "otp does not generated", field: "otp" });
      }

      // check if otp is correct
      if (otpChecked.otp != otp) {
        return res
          .status(400)
          .send({ error: "otp is incorrect", field: "otp" });
      }

      const token_forget_password = crypto.randomBytes(48).toString('base64url');
      console.log("token_forget_password", token_forget_password);

      // save token in db
      await Physio.updateOne({ _id: id }, { $set: { tokenForgetPassword: token_forget_password } });

      // delete otp from db
      await Otp.deleteOne({ _id: otpChecked._id });



      // send id and token
      return res.status(200).send({ id: id, token: token_forget_password });

    } catch (error) {
      console.log(error);
      return next({ message: "internal server error", status: 500 });
    }

  },

  // forgot password reset password
  forgotPasswordResetPassword: async (req, res, next) => {
    try {
      let { id,tokenForgetPassword, password, confirmPassword } = req.body;

      if (!id) {
        return res
          .status(400)
          .send({ error: "id is required", field: "id" });
      }

      if (!tokenForgetPassword) {
        return res
          .status(400)
          .send({ error: "tokenForgetPassword is required", field: "tokenForgetPassword" });
      }

      if (!password) {
        return res
          .status(400)
          .send({ error: "password is required", field: "password" });
      }

      // check password regex
      let passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegExp.test(password)) {
        return res
          .status(400)
          .send({ error: "password must be 8 characters long and must contain at least one uppercase letter, one lowercase letter and one number", field: "password" });
      }

      if (!confirmPassword) {
        return res
          .status(400)
          .send({ error: "confirm password is required", field: "confirmPassword" });
      }

      // check if password and confirm password are same
      if (password !== confirmPassword) {
        return res
          .status(400)
          .send({ error: "password and confirm password are not same", field: "confirmPassword" });
      }

      // check if id exists
      let physio = await Physio.findOne({ _id: id });
      if (!physio) {
        return res
          .status(400)
          .send({ error: "id does not exist", field: "id" });
      }

      // check if tokenForgetPassword exists
      if (physio.tokenForgetPassword !== tokenForgetPassword && physio.tokenForgetPassword !== null && physio.tokenForgetPassword !== "") {
        return res
          .status(400)
          .send({ error: "tokenForgetPassword does not match", field: "tokenForgetPassword" });
      }

      // hash password with bcrypt and salt
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);

      // TODO::can remove one of below two lines
      // update password in db and unset tokenForgetPassword
      await Physio.updateOne({ _id: id }, { password: hashedPassword, salt  });

      // delete tokenForgetPassword from db
      await Physio.updateOne({ _id: id }, { $unset: { tokenForgetPassword: "" } });

      // send success message
      return res.status(200).send({ message: "password reset successful" });

    } catch (error) {
      console.log(error);
      return next({ message: "internal server error", status: 500 });
    }
  },
};