var mongoose = require('mongoose');

var IRXProductLineSchema =new mongoose.Schema({
   name:{type:String,required:true},
   location:{city:String,state:String,country:String,name:String,pincode:String,lat:Number,lon:Number},
   type:{type:String,required:true},
   description: {type:String},
   imageUrl:{type:String},
   builtUpArea:[{lowerRange:Number, higerRange:Number, unit:String}],
   price: {type:String},
   possession :{type:String},
   builderName:{type:String},
   productType :{type:String}
});

IRXProductLineModel = mongoose.model('IRXProductLine', IRXProductLineSchema);
module.exports = IRXProductLineModel;