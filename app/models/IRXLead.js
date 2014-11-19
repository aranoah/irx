var mongoose = require('mongoose');

var IRXLeadsSchema =new mongoose.Schema({
   id:{type:String,required:true},
   projectId:{type:String,required:true},
   agentId: {type:String,required:true},
   name:{type:String,required:true},
   mobileNo:{type:String,required:true},
   emailId:{type:String,required:true},
   type:{type:String,required:true}
});

IRXLeadsModel = mongoose.model('irxlead', IRXLeadsSchema);
module.exports = IRXLeadsModel;