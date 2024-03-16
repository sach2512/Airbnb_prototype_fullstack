const express = require("express");
const mongoose = require("mongoose");

const port = 8180;
const app = express();
const methodOverride = require("method-override");
const data = require('./data/data');
const Listing = require("./models/listingmodel");
app.set("view engine", "ejs");
const path= require("path");
app.set("views", "./views/listings");
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const engine = require("ejs-mate");
app.engine('ejs', engine);
async function main() {
    await mongoose.connect(url);

}

main()
    .then(() => {
        console.log("Connection Successfull");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/listing');
}
app.get('/',async(req,res)=>{
    res.send("hi i am home");
})

app.get('/listing', async (req, res) => {
    const listings = await Listing.find();
    //console.log(listings);
    res.render("index.ejs", { listings });
})

app.get('/listing/details/:id', async (req, res) => {
    let id = req.params.id;
    //console.log(id);
    const listing = await Listing.findById(id);
    res.render("show.ejs", { listing });

})





  app.get('/listing/new', async (req, res) => {
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
        res.redirect('/listing');
    } catch (err) {
        console.error('Error saving new listing:', err);
        res.status(500).send('Internal Server Error');
    }
});





app.get('/listing/:id/edit', async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
    console.log(listing);
})

app.put('/listing/:id/edited', async (req, res) => {
    try {
        let id = req.params.id;
        let { title, description, image, price, location, country } = req.body;
        
        await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            image: image,
            price: price,
            location: location,
            country: country
        });
        
        res.redirect(`/listing/details/${id}`);
    } catch (error) {
        // Handle errors
        console.error("Error updating listing:", error);
        res.status(500).send("Error updating listing");
    }
});

  app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
  });




app.listen(port, (err) => {
    if (err) throw err;
    console.log("server is listening");
})
