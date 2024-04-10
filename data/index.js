const mongoose=require('mongoose');
const initData=require("./data.js");
const Listing=require("../models/listingmodel.js");

const MONGO_URL="mongodb://127.0.0.1:27017/listing";

main().then(()=>{
    console.log("connected to DB");
}).catch(err => {console.error(err);});
 
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB =async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"661493f3acaaa322b165bd3c"}));
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}
initDB();