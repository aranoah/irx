var mongoose = require('mongoose');

var IRXSellProductSchema =new mongoose.Schema({
   name:{type:String,required:true},
   userId:{type:String,required:true},
   location:{city:String,state:String,country:String,name:String,pincode:String,lat:Number,lon:Number},
   type:{type:String,required:true},
   description:{type:String}
});

IRXSellProductModel = mongoose.model('irxselllead', IRXSellProductSchema);
module.exports = IRXSellProductModel;