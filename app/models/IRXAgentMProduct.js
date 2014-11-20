var mongoose = require('mongoose');

var IRXAgentMappingSchema =new mongoose.Schema({
   agentId:{type:String,required:true},
   project:{type:Array,,required:true},
   rank:{type:Number},//indexing
   preferred:{type:Boolean},
   createdOn:{type:Date},
   updatedOn:{type:Date}
});

IRXAgentMappingModel = mongoose.model('irxagentmproduct', IRXAgentMappingSchema);
module.exports = IRXAgentMappingModel;