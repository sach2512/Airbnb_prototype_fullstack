const express= require("express");
const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const listing= require('./listingmodel');
const ReviewSchema= new Schema ({
    review:String,
    rating:{
        type:Number,
        min:1,
        max:5




        
    },
    CreatedAt:{
        type:Date,

        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
   
});


const reviews= mongoose.model("reviews", ReviewSchema);
module.exports=reviews;
