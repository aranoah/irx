var mongoose = require('mongoose');

var IRXBrokerInfoSchema =new mongoose.Schema({
   
   agentId: {type:String,required:true},
   packagePlan : {type:String,required:true}//id of project plan
   createdOn:{type:Date},
   updatedOn:{type:Date}
});

IRXBrokerInfoModel = mongoose.model('irxbrokerinfo', IRXBrokerInfoSchema);
module.exports = IRXBrokerInfoModel;