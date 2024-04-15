const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviews = require('./reviewmodel')

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
      url:String,
      filename:String
    },
    price: Number,
    location: String,
    country: String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"reviews",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    await reviews.deleteMany({ _id: { $in: listing.review } });
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
