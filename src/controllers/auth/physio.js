const createError = require("http-errors");
const mongoose = require("mongoose");

const Physio = require('../user-management/physio');

module.exports = {
  registerGenerateOTP: async (req, res, next) => {
    try {
      let { phone } = req.body;

      if (!phone) {
        return res
          .status(400)
          .send({ error: "Phone number is required", field: "phone" });
      }

      //phone regex E.164 format
      let phoneRegExp = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegExp.test(phone)) {
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
            phoneNumber: phone,
            otp: otp,
        });

        await newPhysio.save();

        return res.status(200).send({ message: "OTP sent successfully" });

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
