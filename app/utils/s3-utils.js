/***********************************************************************
*
* DESCRIPTION :
*       Utilities to integrate and communicate with s3
*  
* Copyright :
*   Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*   Puneet (puneet@aranoah.com)      
*
* START DATE :    
*   11 Nov 2014
*
* CHANGES :
*
**/
var AWS = require('aws-sdk');
var s3bucket = require(_path_initializers+"/07_s3-config")
function S3_UTILS(){

}

S3_UTILS.prototype.uploadData = function(first_argument) {
	var data = {Key: 'test1/ff1', Body: 'Hello!'};
  	s3bucket.putObject(data, function(err, data) {
    if (err) {
      console.log("Error uploading data: ", err);
    } else {
      console.log("Successfully uploaded data to myBucket/myKey");
    }
  });
}
S3_UTILS.prototype.getFile = function(first_argument) {
	var data = {Bucket:"irx",Key: 'test1/ff1'};
  	var file = require('fs').createWriteStream('C:/Users/Raghav/Desktop/postreq.png');
	s3bucket.getObject(data).createReadStream().pipe(file);
}

S3_UTILS.prototype.uploadFile = function(filePath, fileName , remoteFileName) {
	
  var fileBuffer = require('fs').readFileSync(filePath);
  var metaData = this.getContentTypeByFile(fileName);
  
  s3bucket.putObject({
    ACL: 'public-read',
    Key: remoteFileName,
    Body: fileBuffer,
    ContentType: metaData
  }, function(error, response) {
    console.log('uploaded file');
    console.log(arguments);
  });
}
S3_UTILS.prototype.getContentTypeByFile = function(fileName) {
  var rc = 'application/octet-stream';
  var fn = fileName.toLowerCase();

  if (fn.indexOf('.html') >= 0) rc = 'text/html';
  else if (fn.indexOf('.css') >= 0) rc = 'text/css';
  else if (fn.indexOf('.json') >= 0) rc = 'application/json';
  else if (fn.indexOf('.js') >= 0) rc = 'application/x-javascript';
  else if (fn.indexOf('.png') >= 0) rc = 'image/png';
  else if (fn.indexOf('.jpg') >= 0) rc = 'image/jpg';

  return rc;
}
module.exports =  S3_UTILS ;