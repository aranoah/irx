var mongoose = require('mongoose');

var IRXProductLineSchema =new mongoose.Schema({
   name:{type:String,required:true},
   location:{name:String,city:String,state:String,country:String,locality:String,pincode:String,latitude:Number,longitude:Number},
   type:{type:String,required:true},//rent,sell
   description: {type:String},
   profileImage:{type:String},
   bhk:{lowerRange:Number, higerRange:Number},
   gallery:[{url:String}]
   builtUpArea:[{lowerRange:Number, higerRange:Number, unit:String}],
   price: {type:String},
   possession :{type:String},
   builderName:{type:String},
   productType :{type:String},//project or location
   createdOn:{type:Date},
   updatedOn:{type:Date},
   rank:{type:Number}//indexing
});

IRXProductLineModel = mongoose.model('irxproductline', IRXProductLineSchema);
module.exports = IRXProductLineModel;