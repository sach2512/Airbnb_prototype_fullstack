const Listing = require("../models/listingmodel");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const token =process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: token });
module.exports.index=  async (req, res) => {
        const listings = await Listing.find();
        //console.log(listings);
        res.render("index.ejs", { listings });
    }

    module.exports.showlisting= async(req,res)=>{
       
            let id = req.params.id;
            //console.log(id);
            const listing = await Listing.findById(id).populate({
                path:"review",
                populate:{
                    path:"author"
                },
            })
            console.log(listing);
            if(!listing){
                req.flash("fail","listing not found")
                res.redirect('/listing')
            }
            res.render("show.ejs", { listing, user: req.user });
            //console.log(listing);
        
        }
    
        module.exports.addlisting=  async(req,res)=>{
           
   
            await res.render("newlisting.ejs")
            
        
    }

        module.exports.newlisting= async(req,res)=>{
            let { location, country } = req.body;
            const query = `${location} `;
            let response=  await geocodingClient.forwardGeocode({
                query: query,
                limit:1,
            }).send();
           let { title, description, image, price,  } = req.body;
                let url= req.file.path;
                let filename= req.file.filename;
                const newlist = new Listing({
                    title: title,
                    description: description,
                
                    price: price,
                    location: location,
                    country: country
                });
                newlist.owner= req.user;
                newlist.geometry=response.body.features[0].geometry;
                newlist.image={url,filename}
                await newlist.save();
                req.flash("success","listing added sucessfully")
                
                console.log(url);
                console.log(filename);
                res.redirect('/listing');
           console.log(`newlist is ${newlist}`);
        
        }
        

module.exports.edit=async(req,res)=>{
    
        let id = req.params.id;
        let listing = await Listing.findById(id);
        res.render("edit.ejs", { listing });
        //console.log(listing);
    
}


module.exports.edited=async (req, res) => {
    
    let id = req.params.id;
    let { title, description,  price, location, country } = req.body;
    let url= req.file.path;
    let filename= req.file.filename
    const listing=await Listing.findByIdAndUpdate(id, {
        
        title: title,
        description: description,
        
        price: price,
        location: location,
        country: country
    });
    if (typeof req.file !== "undefined") {
        let url= req.file.path;
        let filename= req.file.filename
        listing.image = { url, filename }; // Update the image property
        await listing.save(); // Save the updated listing
    }
   
    req.flash("success","listing successfully edited");
    res.redirect(`/listing/details/${id}`);
 
   

}

module.exports.delete= async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted successfully");
    res.redirect("/listing");
    
  }