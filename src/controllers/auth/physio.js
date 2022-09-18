const createError = require("http-errors");
const mongoose = require("mongoose");

const Physio = require('../user-management/physio');
const Otp = require('../auth/otp');

module.exports = {
  registerGenerateOTP: async (req, res, next) => {
    try {
      let { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res
          .status(400)
          .send({ error: "Phone number is required", field: "phone" });
      }

      //phone regex E.164 format
      let phoneRegExp = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegExp.test(phoneNumber)) {
        return res
          .status(400)
          .send({ error: "Phone number must be E.164 format", field: "phone" });
      }

        //check if phone number is already registered
        let physio = await Physio.findOne({ phoneNumber: phone });
        if (physio) {
            return res
            .status(400)
            .send({ error: "Phone number is already registered", field: "phone" });
        }

        //generate otp
        let otp = generate_otp(4);

        //send otp
        let message = `Your OTP for Physio App is ${otp}`;
        // let response = await send_sms(phone, message);
 
        // save otp and phone number in db
        let newPhysio = new Physio({
          phoneNumber: phoneNumber,
        });

        let savedPhysio = await newPhysio.save();

        let newOtp = new Otp({
          otp: otp,
          physioId: savedPhysio._id,
          type: "register",
          for: "phone",
        });

        let savedOtp = await newOtp.save();

        // send id
        return res.status(200).send({ id: savedPhysio._id });

    } catch (error) {
        console.log(error);
        return next("internal server error");
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
      let isValidOtp = await Otp.findOne({ otp: otp, physioId: id });
      if (!isValidOtp) {
        return res
          .status(400)
          .send({ error: "OTP is not valid", field: "otp" });
      }

      //check if otp is expired
      let isExpired = await Otp.findOne({ otp: otp, physioId: id, createdAt: { $lte: Date.now() - 300000 } });
      if (isExpired) {
        return res
          .status(400)
          .send({ error: "OTP is expired", field: "otp" });
      }

      //delete otp
      await Otp.deleteOne({ otp: otp, physioId: id });

      //send id
      return res.status(200).send({ id: id });

    } catch (error) {
        console.log(error);
        return next("internal server error");
    }
  },

  registerDtails : async (req, res, next) => {
    try {
      let { id, username,  email, password, confirmPassword } = req.body;

      if (!id) {
        return res
          .status(400)
          .send({ error: "id is required", field: "id" });
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

      // check if id is valid
      let isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
        return res
          .status(400)
          .send({ error: "id is not valid", field: "id" });
      }

      // check if id exists
      let physio = await Physio.findById(id);
      if (!physio) {
        return res
          .status(400)
          .send({ error: "id does not exist", field: "id" });
      }

      // hash password
      let hashedPassword = await bcrypt.hash(password, 10);

      // generate token
      let token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      // add token in token_list in db
      await Physio.updateOne({ _id: id }, { $push: { token_list: token }, $set: { username: username, email: email, password: hashedPassword } });

      // send token
      return res.status(200).send({ token: token });

    } catch (error) {
        console.log(error);
        return next("internal server error");
    }
  },

  login : async (req, res, next) => {
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

      // generate token
      let token = jwt.sign({ id: physio._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      // add token in token_list in db
      await Physio.updateOne({ _id: physio._id }, { $push: { token_list: token } });

      // send token
      return res.status(200).send({ token: token });

    } catch (error) {
        console.log(error);
        return next("internal server error");
    }
  },

  logout : async (req, res, next) => {
    try {
      let { token } = req.body;

      if (!token) {
        return res
          .status(400)
          .send({ error: "token is required", field: "token" });
      }

      // check if token is valid
      let isToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!isToken) {
        return res
          .status(400)
          .send({ error: "token is not valid", field: "token" });
      }

      // check if token exists
      let physio = await Physio.findOne({ token_list: token });
      if (!physio) {
        return res
          .status(400)
          .send({ error: "token does not exist", field: "token" });
      }

      // remove token from token_list in db
      await Physio.updateOne({ _id: physio._id }, { $pull: { token_list: token } });

      // send success message
      return res.status(200).send({ message: "logout successful" });

    } catch (error) {
        console.log(error);
        return next("internal server error");
    }
  },

  // forgot password
  forgotPasswordGenerateOTP : async (req, res, next) => {
    try {
      let { emailOrPhone } = req.body;

      if (!emailOrPhone) {
        return res
          .status(400)
          .send({ error: "email or phone is required", field: "emailOrPhone" });
      }

      // check if email or phone exists
      let physio = await Physio.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });
      if (!physio) {
        return res
          .status(400)
          .send({ error: "email or phone does not exist", field: "emailOrPhone" });
      }

      //generate otp
      let otp = generate_otp(4);

      // send otp to email or phone
      if (physio.email) {
        // send otp to email
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });

        let mailOptions = {
          from: process.env.EMAIL,
          to: physio.email,
          subject: "Forgot Password",
          text: `Your OTP is ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return next("internal server error");
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      } 
      
      if (physio.phone) {
        // send otp to phone
        
      }

      // save otp in db
      let newOtp = new Otp({
        otp: otp,
        physioId: savedPhysio._id,
        type: "forgotPassword",
        for: "phone",
      });

      let savedOtp = await newOtp.save();

      // send username and id
      return res.status(200).send({ username: physio.username, id: physio._id });
      
    } catch (error) {
        console.log(error);
        return next("internal server error");
    }
  },

  // forgot password verify otp
  forgotPasswordVerifyOTP : async (req, res, next) => {
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
      let otpChecked = await Otp.findOne({ physioId: id, otp: otp });
      if (!otpChecked) {
        return res
          .status(400)
          .send({ error: "otp does not exist", field: "otp" });
      }

      // check if otp is valid
      let isOtp = otp.verifyOtp(otp);
      if (!isOtp) {
        return res
          .status(400)
          .send({ error: "otp is not valid", field: "otp" });
      }

      // send success message and id
      return res.status(200).send({ message: "otp verified", id: id });

    } catch (error) {
        console.log(error);
        return next("internal server error");
    }

  },

  // forgot password reset password
  forgotPasswordResetPassword : async (req, res, next) => {
    try {
      let { id, password, confirmPassword } = req.body;

      if (!id) {
        return res
          .status(400)
          .send({ error: "id is required", field: "id" });  
      }

      if (!password) {
        return res
          .status(400)
          .send({ error: "password is required", field: "password" });
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

      // check if password is valid
      let isPassword = passwordValidator.validate(password);
      if (!isPassword) {
        return res
          .status(400)
          .send({ error: "password is not valid", field: "password" });
      }

      // check if id exists
      let physio = await Physio.findOne({ _id: id });
      if (!physio) {
        return res
          .status(400)
          .send({ error: "id does not exist", field: "id" });
      }

      // hash password
      let hashedPassword = await bcrypt.hash(password, 10);

      // update password in db
      await Physio.updateOne({ _id: id }, { password: hashedPassword });

      // send success message
      return res.status(200).send({ message: "password reset successful" });

    } catch (error) {
        console.log(error);
        return next("internal server error");
    }
  },









//   createNewProduct: async (req, res, next) => {
//     try {
//       const product = new Product(req.body);
//       const result = await product.save();
//       res.send(result);
//     } catch (error) {
//       console.log(error.message);
//       if (error.name === "ValidationError") {
//         next(createError(422, error.message));
//         return;
//       }
//       next(error);
//     }

    /*Or:
  If you want to use the Promise based approach*/
    /*
  const product = new Product({
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => {
      console.log(err.message);
    }); 
    */
//   },

//   findProductById: async (req, res, next) => {
//     const id = req.params.id;
//     try {
//       const product = await Product.findById(id);
//       // const product = await Product.findOne({ _id: id });
//       if (!product) {
//         throw createError(404, "Product does not exist.");
//       }
//       res.send(product);
//     } catch (error) {
//       console.log(error.message);
//       if (error instanceof mongoose.CastError) {
//         next(createError(400, "Invalid Product id"));
//         return;
//       }
//       next(error);
//     }
//   },

//   updateAProduct: async (req, res, next) => {
//     try {
//       const id = req.params.id;
//       const updates = req.body;
//       const options = { new: true };

//       const result = await Product.findByIdAndUpdate(id, updates, options);
//       if (!result) {
//         throw createError(404, "Product does not exist");
//       }
//       res.send(result);
//     } catch (error) {
//       console.log(error.message);
//       if (error instanceof mongoose.CastError) {
//         return next(createError(400, "Invalid Product Id"));
//       }

//       next(error);
//     }
//   },

//   deleteAProduct: async (req, res, next) => {
//     const id = req.params.id;
//     try {
//       const result = await Product.findByIdAndDelete(id);
//       // console.log(result);
//       if (!result) {
//         throw createError(404, "Product does not exist.");
//       }
//       res.send(result);
//     } catch (error) {
//       console.log(error.message);
//       if (error instanceof mongoose.CastError) {
//         next(createError(400, "Invalid Product id"));
//         return;
//       }
//       next(error);
//     }
//   },
};
