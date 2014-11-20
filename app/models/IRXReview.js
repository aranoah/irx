var mongoose = require('mongoose');

var IRXReviewSchema =new mongoose.Schema({
   msg:{type:String,required:true},
   parentId:{type:String,required:true},
   agentId: {type:String,required:true},
   name:{type:String,required:true},
   likeCount:{type:Number},
   likedByUser:[{userId:String}],
   ratingByUser:[{userId:String,rating:Number}]
   rating:{type:Number},
   ratingCount:{type:Number},
   updatedOn:{type:Date},
   postedOn:{type:Date}
  
});

IRXReviewModel = mongoose.model('irxreview', IRXReviewSchema);
module.exports = IRXReviewModel;