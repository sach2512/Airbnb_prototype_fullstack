const express= require("express");
const mongoose= require("mongoose");
const url="mongodb://localhost:27017/sachin"
const port=8080;
const app=express();
const methodOverride = require("method-override");
const data= require('./data/data');
const Listing = require("./models/listingmodel");
app.set("view engine", "ejs");
app.set("views", "./views/listings");
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
async function main(){
    await mongoose.connect(url);
   
   }
   
   main()
   .then(()=>{
      console.log("Connection Successfull");
   })
   .catch(err => console.log(err));
  
   async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/listing');
  }


app.get('/listing', async (req,res)=>{
    const listings = await Listing.find({});
    //console.log(listings);
    res.render("index.ejs",{listings});
})

app.get('/listing/details/:id',async (req,res)=>{
    let id= req.params.id;
    //console.log(id);
    const listing = await Listing.findById(id);
    res.render("show.ejs",{listing});
  
})






app.get('/listing/new',async (req,res)=>{
    await res.render("newlisting.ejs");
})

app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  });



app.get('/listing/:id/edit', async (req,res)=>{
    let id= req.params.id;
   let listing=  await Listing.findById(id);
   res.render("edit.ejs",{listing});
   console.log(listing);
})

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/details/${id}`);
  });

  app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
  });

app.listen(port,(err)=>{ 
    if(err) throw err;
    console.log("server is listening");
})
