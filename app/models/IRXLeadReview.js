var mongoose = require('mongoose');

var IRXLeadReviewSchema =new mongoose.Schema({
   projectId:{type:String,required:true},
   agentId: {type:String,required:true},
   name:{type:String,required:true},
   mobileNo:{type:String,required:true},
   emailId:{type:String,required:true},
   type:{type:String,required:true},
   createdOn:{type:Date},
   updatedOn:{type:Date},
   status:{type:String},
   reviewedBy:{type:String}
});

IRXLeadReviewModel = mongoose.model('irxleadreview', IRXLeadReviewSchema);
module.exports = IRXLeadReviewModel;