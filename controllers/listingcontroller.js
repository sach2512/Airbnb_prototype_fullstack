const Listing = require("../models/listingmodel");;
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
            
   
   
   
                let { title, description, image, price, location, country } = req.body;
        
                const newlist = new Listing({
                    title: title,
                    description: description,
                    image: image,
                    price: price,
                    location: location,
                    country: country
                });
                newlist.owner= req.user;
                await newlist.save();
                req.flash("success","listing added sucessfully")
                
                res.redirect('/listing');
           
            
        }
        

module.exports.edit=async(req,res)=>{
    
        let id = req.params.id;
        let listing = await Listing.findById(id);
        res.render("edit.ejs", { listing });
        //console.log(listing);
    
}


module.exports.edited=async (req, res) => {
    
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