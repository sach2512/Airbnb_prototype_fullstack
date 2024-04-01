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
        type: String,
        default: "https://images.unsplash.com/photo-1446889727648-8c23e3039b24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
        set: function (v) {
            if (v && typeof v === 'object' && v.url) {
                return v.url;
            } else if (v === "") {
                return "https://images.unsplash.com/photo-1446889727648-8c23e3039b24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80";
            } else {
                return v;
            }
        }
    },
    price: Number,
    location: String,
    country: String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"reviews",
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    await reviews.deleteMany({ reviews: { $in: listing.reviews } });
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
