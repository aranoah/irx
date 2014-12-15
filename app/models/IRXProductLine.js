/***********************************************************************
*
* DESCRIPTION :
*       Database model for products.Products can be either location projects 
*       or physical builder projects
*  
* Copyright :
*     Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*     Puneet (puneet@aranoah.com)      
*
* START DATE :    
*     11 Nov 2014
*
* CHANGES :
*
**/
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
  _ObjectID = Schema.ObjectId;
var IRXProductLineSchema =new mongoose.Schema({
  _id:{type:_ObjectID},
   name:{type:String,required:true},
   location:{name:String,city:String,state:String,country:String,locality:String,pincode:String,latitude:Number,longitude:Number},
   type:{type:String,required:true},//rent,sell
   description: {type:String},
   profileImage:{type:String},
   bhk:{lowerRange:Number, higerRange:Number},
   gallery:[{url:String}],
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