var AWS = require('aws-sdk');
var config = new AWS.Config({
  accessKeyId: 'AKIAIATDJOLIBPBTPXEQ', secretAccessKey: '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', region: 'us-east-1'
});

AWS.config= config;
module.exports=AWS;