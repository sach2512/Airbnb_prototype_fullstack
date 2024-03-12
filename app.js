const express= require("express");
const mongoose= require("mongoose");
const ejs= require("ejs");
const url="mongodb://localhost:27017/listing"
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
   
   main().then(()=>{
       console.log("connected")
}).catch(()=>{
       console.log( " not connected")
   })

   const initDB= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    //console.log("data");

}

initDB();

app.get('/listing', async (req,res)=>{
  
    const listings = await Listing.find({}).maxTimeMS(20000);
    //console.log(listings);
    res.render("index.ejs",{listings});
})

app.get('/listing/deatils/:id',async (req,res)=>{
    let id= req.params.id;
    //console.log(id);
    const listing = await Listing.findById(id);
    res.render("show.ejs",{listing});
  
})

// app.get('/listing/new',(req,res)=>{
//     res.render("newlisting.ejs");
// })

// app.post('/newlisting', async (req, res) => {
//     let title = req.body.title;
  
//   console.log(title);
    
// });

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



app.get('/listing/:id/edit', async (req,res)=>{
    let id= req.params.id;
   let listing=  await Listing.findById(id);
   res.render("edit.ejs",{listing});
   console.log(listing);
})

app.put('/listing/:id/edited',async(req,res)=>{
    let id= req.params.id;
    let {title,description,image,price,location,country}=req.body
    await Listing.findByIdAndUpdate(id,{ ... req.body});
        res.render("index.ejs");
})

app.listen(port,(err)=>{ 
    if(err) throw err;
    console.log("server is listening");
})
