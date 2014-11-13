var mongoose = require('mongoose');

var IRXAgentMappingSchema =new mongoose.Schema({
   agentId:{type:String}
   projects:{type:Array}
});

IRXAgentMappingModel = mongoose.model('IRXAgentMapping', IRXAgentMappingSchema);
module.exports = IRXAgentMappingModel;