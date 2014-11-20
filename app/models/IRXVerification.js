var mongoose = require('mongoose');

var IRXVerificationSchema =new mongoose.Schema({
   
   userId:{type:String,reqired:true},
   vfCode:{type:String,reqired:true},
   vfData :{type:String,reqired:true},
   createdOn:{type:Date,reqired:true},
   updatedOn:{type:Date,reqired:true}
});

IRXVerificationModel = mongoose.model('irxverification', IRXVerificationSchema);
module.exports = IRXVerificationModel;
