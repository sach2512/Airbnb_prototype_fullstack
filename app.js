const express= require("express");
const mongoose= require("mongoose");
const app= express();
const path=require("path");
let port= 8080;
const ObjectId= require("mongoose").ObjectId;

const Listing= require('./models/listing.js')
const main = require('./db.js');

app.set("view engine","ejs");

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.set("views",'./views/listings');

app.get('/',(req,res)=>{
    res.send("health is ok")
})

// showing all listing

app.get('/listings', async (req, res) => {
    try {
        let listing = await Listing.find();
        res.send(listing);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/listings/:id/details',async (req,res)=>{
    let id= req.params.id;
    console.log(id);
    let listing=await Listing.findById(id);
    console.log(listing);
    res.render("show.ejs",{listing})
    
})



// create new listing

app.get('/listing/new',(req,res)=>{
    res.render("newlisting.ejs");
})


app.post('/newlisting', async (req,res)=>{
    let {title,description,price,location,country} = req.body;
    const newlisting = new Listing({
        title: title,  
        description: description,  
        price: Number(price),  
        location: location,  
        country: country  
    });
    newlisting.save();
  
   console.log(listing);
})











app.listen(port,(err)=>{

    if(err){
        console.log(" error while listening");
    }else{
        console.log("  listening");
    }
})