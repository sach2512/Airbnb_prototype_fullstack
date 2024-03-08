const express= require("express");
const mongoose= require("mongoose");
const ejs= require("ejs");
const url="mongodb://localhost:27017/listing"
const port=3896;
const app=express();
const data= require('./data/data');
const Listing = require('./models/listingmodel');

async function main(){
 await mongoose.connect(url);

}

main().then(()=>{
    console.log("connected")
    const listing=   Listing.insertMany(data);
    console.log(data);
  
    
}).catch(()=>{
    console.log( " not connected")
})


app.get('/test',(req,res)=>{
   const testlisting = new Listing ({
    title:"hey",
    description:"hey",
    price:1200,
    location:"garla",
    country:"india",

   })
   testlisting.save();
   console.log(testlisting);
})






app.listen(port,(err)=>{
    if(err) throw err;
    console.log("server is listening");
})