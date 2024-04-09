const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose= require("passport-local-mongoose");


const UserSchema= new Schema({
   email:{
    type:String,
    require:true
   }
//    password:{
//     type:String,
//     require:true,
//    },
//    username:{
//     type:String,
//     require:true,
//    }             // in passport local mongoose it automatically stores name and password by adding salting and hashing  even if we define or dnt define in mongoose

})

UserSchema.plugin(PassportLocalMongoose);// we are passing as plugin in our schema we used as pluginbecause automatically implemets saltinh hashing

const User= mongoose.model('User',UserSchema);
module.exports=User;