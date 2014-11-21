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

var IRXLocationSchema =new mongoose.Schema({
  locality:{type:String,required:true},
  name:{type:String,required:true},
  city:{type:String,required:true},
  state:{type:String,required:true},
  country:{type:String,required:true},
  pincode :{type:String,required:true},
  latitude :{type:Number,required:true},
  longitude :{type:Number,required:true}
});

IRXLocationModel = mongoose.model('irxlocation', IRXLocationSchema);
module.exports = IRXLocationModel;