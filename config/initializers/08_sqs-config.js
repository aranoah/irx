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

	var AWS = require('aws-sdk'),
    awsCredentialsPath = '/../../app/utils/sqsCredential.json',
    sqsQueueUrl = 'https://sqs.us-east-1.amazonaws.com/916217014216/IRX-test',
  
    sqs;
	// Load credentials from local json file
  
	// Instantiate SQS client
	sqs = new AWS.SQS();
 
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
    sqs.deleteMessage({
                "QueueUrl" : sqsQueueUrl,
                "ReceiptHandle" :data.Messages[0].ReceiptHandle
              }, function(err, data){                
              });
      sqs.sendMessage({
                "QueueUrl" : sqsQueueUrl,
                "MessageBody" :"Test"
              }, function(err, data){                
              });
   
   }
   queueReciever();
 });
  }
queueReciever();

