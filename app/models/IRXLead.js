var mongoose = require('mongoose');

var IRXLeadsSchema =new mongoose.Schema({
   leadId:{type:String,required:true},//from irxleadreview
   type:{type:String,required:true},
   createdOn:{type:Date},
   updatedOn:{type:Date}
});

IRXLeadsModel = mongoose.model('irxlead', IRXLeadsSchema);
module.exports = IRXLeadsModel;