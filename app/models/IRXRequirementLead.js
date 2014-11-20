var mongoose = require('mongoose');

var IRXRequirementLeadSchema =new mongoose.Schema({
   projectName:{type:String,required:true},
   location:{city:String,state:String,country:String,name:String,locality,String,pincode:String,latitude:Number,longitude:Number},
   agentId: {type:String,required:true},//need to be discussed
   name:{type:String,required:true},
   mobileNo:{type:String,required:true},
   emailId:{type:String,required:true},
   agentType:{type:String,required:true},//dealer or user
   createdOn:{type:Date},
   updatedOn:{type:Date},
   status:{type:String},
   reviewedBy:{type:String}
});

IRXRequirementLeadModel = mongoose.model('irxrequirementlead', IRXRequirementLeadSchema);
module.exports = IRXRequirementLeadModel;