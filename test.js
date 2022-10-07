// import express from "express";
const express = require("express")
const fs = require("fs");
// const ejs = require("ejs");

const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://rahulcheruku:Super5rocks!@cluster0.xq03ee9.mongodb.net/DrainageOverflowManagement?retryWrites=true&w=majority", { useNewUrlParser: true },
(err)=>{
    if(err) throw err;
    console.log("connected to mongodb");
}
);

const dataSchema = new mongoose.Schema({
    name: {
        type: String, required: true,
    },
    problem: {
        type: String,
    },
    location: {
        type: String,
    },
},
{
    timestamps: true
});
  
const Data = mongoose.model('data', dataSchema)





const app = express();

app.set("view engine", "ejs");

app.use((req,res, next)=>{
    console.log("req.url", req.url);
    next();
});

// app.get("/", function (req, res){
//     fs.readFile("score.txt", (err, data)=>{
//         console.log("data", data);
//         var stg = data.toString()
//         var arr = stg.split("_") 
//         console.log("arr", arr);
//         res.render("index.ejs", {problem: arr[0], location: arr[1], date_time: arr[2]})

//     })
// });


app.get("/data", async function (req, res){

    const data = await Data.find();

    res.send(data);

});

app.get("/data/:name", async function (req, res){

    // get last saved data
    const data = await Data.find({name: req.params.name}).sort({createdAt: -1}).limit(1);

    res.send(data);

});



app.get("/currentlevel/:current", (req,res) =>{
    let currentlevel = req.params.current;

    console.log("current", currentlevel);

    var arr = currentlevel.split("_")

    var name = arr[0]
    var problem = arr[1]
    var location = arr[2]

    const data = new Data({
        name,
        problem,
        location
    });

    data.save();

    // if (currentlevel ==2 ){
    //     res.send("vatlagi padi hai")
    //         }

    // const date = new Date();

    // currentlevel = currentlevel + "_" + date

    // fs.writeFile("score.txt", currentlevel, (err)=>{
    res.send("success")
    // })
});

app.post("/getdata", (req, res) =>{

});

const Port = process.env.PORT || 3000;
app.listen(Port);
