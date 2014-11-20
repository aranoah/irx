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
