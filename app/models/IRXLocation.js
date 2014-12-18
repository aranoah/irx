/***********************************************************************
*
* DESCRIPTION :
*       Database model for locations
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		11 Nov 2014
*
* CHANGES :
*
**/
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var IRXLocationSchema =new mongoose.Schema({

	_id:{type:ObjectId,required:true},
	location:{locality:String,city:String,state:String,country:String,pincode:String,latitude:Number,longitude:Number},
  
  name:{type:String,required:true}
});

IRXLocationModel = mongoose.model('irxlocation', IRXLocationSchema);
module.exports = IRXLocationModel;