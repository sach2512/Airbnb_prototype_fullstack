const express= require("express");
const mongoose= require("mongoose");
const app= express();
let port= 8080;

const Listing= require('./models/listing.js')
const main = require('./db.js');

app.set("view engine","ejs");

app.use(express.static(__dirname + '/public'));


app.set("views",'./views/listings')



app.get('/',(req,res)=>{
    res.send("health is ok")
})



app.get('/listings',(req,res)=>{
 let listing=Listing.find({}).then((data)=>{
    res.render("index.ejs",{Listing});
 })

})




app.listen(port,(err)=>{

    if(err){
        console.log(" error while listening");
    }else{
        console.log("  listening");
    }
})