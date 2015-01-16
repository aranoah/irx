/***********************************************************************
*
* DESCRIPTION :
*       Utilities to integrate and communicate sqs amazon queue
*  
* Copyright :
*   Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*   Puneet (puneet@aranoah.com)      
*
* START DATE :    
*  15 Jan 2014
*
* CHANGES :
*
**/
var emailUtils = require(_path_util+"/email-utils.js");
var emailTemplates = require('email-templates');
var mongoose = require('mongoose');
var properties = require(_path_env+"/properties.js");
var IRXLeadModel = require(_path_model+"/IRXLead");
  var AWS = require('aws-sdk'),
    awsCredentialsPath = '/../../app/utils/sqsCredential.json',
    sqsQueueUrl = 'https://sqs.us-east-1.amazonaws.com/916217014216/IRX-test',
  
    sqs;
	// Load credentials from local json file
  
	// Instantiate SQS client
	sqs = new AWS.SQS();
  _app_context.sqs=sqs;
  _app_context.qUrl=sqsQueueUrl;
  //console.log("hello",sqs)
  function queueReciever(){
    sqs.receiveMessage({
   QueueUrl: sqsQueueUrl,
   MaxNumberOfMessages: 1, // how many messages do we wanna retrieve?
   VisibilityTimeout: 60, // seconds - how long we want a lock on this job
   WaitTimeSeconds: 3 // seconds - how long should we wait for a message?
 }, function(err, data) {
   // If there are any messages to get
   console.log(data)

   if (data.Messages) {
    // console.log(data)
    //   // Get the first message (should be the only one since we said to only get one above)
    //   var message = data.Messages[0],
    //       body = JSON.parse(message.Body);
    //   // Now this is where you'd do something with this message
    //   doSomethingCool(body, message);  // whatever you wanna do
    //   // Clean up after yourself... delete this message from the queue, so it's not executed again
    //   removeFromQueue(message);  // We'll do this in a second
    var messages  = data.Messages;
    for(var i=0;i<messages.length;i++){
      var message  = messages[i];
      if(message && message.Body){
        var messageData = JSON.parse(message.Body);
        if(messageData.action == 'leads'){
            
            IRXLeadModel.findOne({ 'id': messageData.data }, function (err, lead) {
              if (err){
               console.log(err)
              } else{
                var locals = {
                "name": lead.name,
                "proName":lead.projectId,
                "subject":properties.leads_subject,
                "mobileNo":lead.mobileNo,
                "userId":lead.emailId
              }
              new emailUtils().sendEmail("post-req",locals,function(error,success){
                if(error != null){
                  console.error(error);
                }else if(success != null){
                  console.log(success)
                }
              });
                
              }
            })
          
        }
      }
    }
    sqs.deleteMessage({
                "QueueUrl" : sqsQueueUrl,
                "ReceiptHandle" :data.Messages[0].ReceiptHandle
              }, function(err, data){                
              });
      
   
   }
   queueReciever();
 });
  }
queueReciever();

