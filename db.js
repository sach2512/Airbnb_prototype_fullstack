const mongoose= require("mongoose");
const initdata= require('./data/All_Listing.js');
const Listing= require('./models/listing.js');

const url="mongodb://localhost:27017/major"

async function main(){
    await mongoose.connect(url);
}
main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log("error while connecting")
})


const initDB= async function adddata(){
  
  await Listing.insertMany(initdata.data);
  console.log("data is added");
}
module.exports=main;
initDB();