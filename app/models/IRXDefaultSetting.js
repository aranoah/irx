/***********************************************************************
*
* DESCRIPTION :
*       Database model for default configurations
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

var IRXDefaultSettingSchema =new mongoose.Schema({
   key:{type:String,reqired:true},
   value:{type:String,reqired:true},
   type :{type:String},
   description:{type:Date},
   label:{type:Date}
});

IRXDefaultSettingModel = mongoose.model('irxdefaultsetting', IRXDefaultSettingSchema);
module.exports = IRXDefaultSettingModel;
