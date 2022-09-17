const express = require("express");
// const ejs = require("ejs");
const cors = require("cors");

const Port = process.env.PORT || 3000;

// configure mongodb
require("./db/mongo");

//  configure express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// serve express app
const server = app.listen(Port, () => {
    console.log(`server is running at port http://localhost:${Port}`);
});

// setup routes
const router = require("./src/routes")();
app.use(router);

//404 handler and pass to error handler
app.use((req, res, next) => {
  
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});


//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});