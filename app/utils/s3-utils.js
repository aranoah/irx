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

var s3bucket = new AWS.S3({params: {Bucket: 'irx'}});
var properties = require(_path_env+'/properties');
var events = require('events');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;

function S3_UTILS(){
   this.eventEmitter = new events.EventEmitter();
}

S3_UTILS.prototype.on = function(callback){
  this.eventEmitter.on("taskcomplete",callback);
}

S3_UTILS.prototype.uploadData = function(bodyMessage) {
	var data = {Key: 'test1/ff1', Body: bodyMessage};
  	s3bucket.putObject(data, function(err, data) {
    if (err) {
      console.log("Error uploading data: ", err);
    } else {
      console.log("Successfully uploaded data to myBucket/myKey");
    }
  });
}

S3_UTILS.prototype.getFile = function(location) {
	var data = {Bucket:"irx",Key: 'test1/ff1'};
  var file = require('fs').createWriteStream(location);
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
    console.log('file uploaded');
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

S3_UTILS.prototype.deleteObject = function(name){
  
  var params = {
     Key: name /* required */
  };
  
  s3bucket.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

S3_UTILS.prototype.listObjects = function(){
  var _self=this;
  var params = {
  
    Delimiter: '',
    EncodingType: 'url'
    //Marker: 'STRING_VALUE',
    //MaxKeys: 0,
    //Prefix: 'STRING_VALUE'
  };
  
  s3bucket.listObjects(params, function(err, data) {
    if (err){
      console.log(err, err.stack); // an error occurred
    } 
    else { 
      var bucketContents = data.Contents;
      var resultArr=new Array();
      for (var i = 0; i < bucketContents.length; i++){
        var urlParams = {Key: bucketContents[i].Key};
        var uri = "http://"+properties.s3_host_name+"/"+bucketContents[i].Key;
        var result = {
                      url:uri,
                      name:bucketContents[i].Key
                    }

        resultArr.push(result);            
        // s3bucket.getSignedUrl('getObject',urlParams, function(err, url){
        // console.log('the url of the image is', url);
        // });
      }
      //console.log(resultArr)
      _self.eventEmitter.emit("dbCompletion","success",STATUS.OK.msg,resultArr,resultArr.length);
    }  
  });
  
  
}

S3_UTILS.prototype.getBucketWebsite=function(){
  s3bucket.getBucketWebsite({}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}
module.exports =  S3_UTILS ;