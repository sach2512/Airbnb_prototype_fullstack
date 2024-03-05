const express= require("express");
const mongoose= require("mongoose");
const app= express();
let port= 8880;
const ObjectId= require("mongoose").ObjectId;

const Listing= require('./models/listing.js')
const main = require('./db.js');

app.set("view engine","ejs");

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));


app.set("views",'./views/listings')



app.get('/',(req,res)=>{
    res.send("health is ok")
})





app.get('/listings',async(req,res)=>{
    let listing=await Listing.find({})
   res.render("index.ejs",{listing});
   
   })

   app.get('/listings/show/:id',async (req,res)=>{
    let id= req.params.id;
    //let mongoid= new ObjectId(id);
    console.log(id);
    let eachlisting= await Listing.find({_id:id})
    console.log(eachlisting);
    res.render("show.ejs",{eachlisting});
})

// adding new listing
app.get('/listing/new',async (req,res)=>{
    await res.render("newlisting.ejs");
})

app.post('/newlisting', async (req, res) => {
    try {
        let { title, description, image, price, location, country } = req.body;

        const newlist = new Listing({
            title: title,
            description: description,
            image: image,
            price: price,
            location: location,
            country: country
        });

        await newlist.save();
        res.render("index.ejs");
    } catch (err) {
        console.error('Error saving new listing:', err);
        res.status(500).send('Internal Server Error');
    }
});


//update and edit data




app.listen(port,(err)=>{

    if(err){
        console.log(" error while listening");
    }else{
        console.log("  listening");
    }
})