
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
var CONSTANTS = require(_path_util+'/constants');
var baseService = require(_path_service+"/base/baseService.js" )
var VERIFICATION_TYPE = CONSTANTS.VERIFICATION_TYPE;
var MAIL_TYPE = CONSTANTS.MAIL_TYPE;
var emailUtils = require(_path_util+"/email-utils.js");
var smsUtils = require(_path_util+"/sms-utils.js")
var emailTemplates = require('email-templates');
var mongoose = require('mongoose');
var properties = require(_path_env+"/properties.js");
var IRXLeadModel = require(_path_model+"/IRXLead");
var IRXUserProfileModel = require(_path_model+"/IRXUser");
var IRXVerificationModel = require(_path_model+"/IRXVerification");
var IRXProductLineModel = require(_path_model+"/IRXProductLine");

  var AWS = require('aws-sdk'),
    awsCredentialsPath = '/../../app/utils/sqsCredential.json',
    sqsQueueUrl = 'https://sqs.us-east-1.amazonaws.com/200272287032/IRX',
  
    sqs;
	// Load credentials from local json file
  
	// Instantiate SQS client
	sqs = new AWS.SQS();
  _app_context.sqs=sqs;
  _app_context.qUrl=sqsQueueUrl;
  var logger=_app_context.logger ;
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
   try{
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
        if(messageData.action == MAIL_TYPE.REGISTER){
          var type =  VERIFICATION_TYPE.ACCOUNT;
          logger.log("debug","Send Register Mail")
           IRXVerificationModel.findOne({ 'userId': messageData.data,"type":type }, function (err, sVerification) {
            if (err){
               console.log(err)
              } else{
               var locals = {
                  "irxId": sVerification.vfData,
                  "userId":sVerification.emailId,
                  "subject":properties.registeration_subject,
                  "vfCode":sVerification.vfCode
                }
                 new emailUtils().sendEmail("register",locals,function(error,success){

                if(error != null){
                 logger.log("error",error)
                }else if(success != null){
                  logger.log("debug",success)
                }
              });
              }
           })

             
        }else if(messageData.action == MAIL_TYPE.FORGET_PASSWORD){
          var type =  VERIFICATION_TYPE.PASSWORD;
           IRXVerificationModel.findOne({ 'emailId': messageData.data,"type":type }, function (err, sVerification) {
            if (err){
               logger.log("error",err)
              } else{
                var url="irx/reset?code="+sVerification.vfCode+"&userId="+sVerification.vfData
               var locals = {
                  
                  "userId":sVerification.emailId,
                  "subject":properties.registeration_subject,
                  "url":url
                }
                 new emailUtils().sendEmail("forget-password",locals,function(error,success){

                if(error != null){
                  logger.log("error",error)
                }else if(success != null){
                   logger.log("debug",success)
                }
              });
              }
           })

             
        }else if(messageData.action == MAIL_TYPE.PROJECT_DETAILS){
          var url = properties.pro_det_url+messageData.data.projectId
          var locals = {
                "url": url,
                "userId":messageData.data.userId,
                "subject":properties.detail_subject,
              }
              new emailUtils().sendEmail(MAIL_TYPE.PROJECT_DETAILS,locals,function(error,success){
                if(error != null){
                   logger.log("error",error)
                }else if(success != null){
                   logger.log("debug",success)
                }
              });
        }else if(messageData.action == MAIL_TYPE.VERIFICATION){
          new smsUtils().sendSms({"msg":properties.phone_sms,"phoneNo":messageData.phoneNum});
        }else if(messageData.action == MAIL_TYPE.USER_DETAILS){
        
          IRXUserProfileModel.findOne({"irxId":messageData.irxId},{"name":1,"userId":1,"phoneNum":1},
          function(err,agent){
              if(err){
                 logger.log("error",err)
                 }else {
                  if(agent != null){
                     var locals = {
                    "name":agent.name,
                    "emailAddress":agent.userId,
                    "phoneNum":agent.phoneNum,
                    "subject":properties.user_detail_subject,
                    "userId":messageData.targetEmailId
                      }
                      new emailUtils().sendEmail(MAIL_TYPE.USER_DETAILS,locals,function(error,success){
                        if(error != null){
                           logger.log("error",error)
                        }else if(success != null){
                           logger.log("debug",success)
                        }
                      });
                  } else{
                     logger.log("debug","Agent not found")
                  }
               }
            })
           
        }else if(messageData.action == MAIL_TYPE.LEAD){
            // Send Email and sms to user 
            IRXLeadModel.findOne({ 'id': messageData.data }, function (err, lead) {
              if (err || !lead){
               console.log(err)
               logger.log("error",err);
              } else{
                    var locals = {
                    "name": lead.name,
                    "proName":lead.projectName,
                    "proId":lead.projectId,
                    "subject":properties.leads_success_subject,
                    "mobileNo":lead.mobileNo,
                    "userId":lead.emailId,
                    "password":messageData.password,
                    "action":lead.action
                  }
                  new emailUtils().sendEmail("post-req",locals,function(error,success){
                    if(error != null){
                      console.error(error);
                      logger.log("error",error);
                    }else if(success != null){
                      console.log(success)
                      logger.log("debug",success);
                    }
                  });
                  new smsUtils().sendSms({"msg":properties.phone_sms,"phoneNo":"9871633757"});
                      locals.userId = properties.irx_agent;
                      locals.subject = properties.leads_subject;
                  new emailUtils().sendEmail("leads",locals,function(error,success){
                        if(error != null){
                          console.error(error);
                          logger.log("error",error);
                        }else if(success != null){
                          console.log(success)
                          logger.log("debug",success);
                        }
                      });
              //new smsUtils().sendSms({"msg":properties.leads_message});
                // send email to broker
                if(lead.agentId && lead.agentId != ""){

                  IRXUserProfileModel.findOne({"status":CONSTANTS.him_constants.USER_STATUS.VERIFIED,"irxId":lead.agentId},{},{limit:5 },function(err,user){
                  if(err){
                    console.log(err)
                    logger.log("error",err);
                  }else{
                    if(user != null){
                      locals.userId = user.userId;
                      locals.subject = properties.leads_subject;
                      new emailUtils().sendEmail("leads",locals,function(error,success){
                        if(error != null){
                          console.error(error);
                          logger.log("error",error);
                        }else if(success != null){
                          console.log(success)
                          logger.log("debug",success);
                        }
                      });
                    }
                     
                  }
                })
                }else {
                  var query ={"status":CONSTANTS.him_constants.USER_STATUS.VERIFIED}
                  baseSvc = new baseService();
                  if(lead.projectId){
                    IRXProductLineModel.findOne({"id":lead.projectId},{"id":1,"location":1},function(err, project){
                        if(err){
                          console.log(err);
                          logger.log("error",err);
                        }else{
                            if(project != null && project.location != null){
                              query["locationMapper.city"]=project.location.city;
                            }
                            
                          IRXUserProfileModel.find(query,{"irxId":1,"userId":1},{limit:5 },function(err,users){
                          if(err){
                            console.log(err)
                          }else{
                             if(users == null){
                              return;
                             }
                            
                            for (var i=0; i<users.length;i++){
                                locals.userId=users[i].userId;
                                console.log(locals.userId)
                                locals.subject = properties.leads_subject;
                                // update user
                                IRXUserProfileModel.update({"irxId":users[i].irxId},{$set:{"updatedOn":new Date()}},function(err,numberAffected,data){
                                  if(err){
                                    logger.log("error",err)
                                  } else{
                                    if(numberAffected >0){
                                      logger.log("debug","user updated for sent mail")
                                    }else{
                                      logger.log("debug","user not updated for sent mail")
                                    }
                                  }
                                })

                                // update leads
                                var id = baseSvc.getCustomMongoId("IL");

                                var nLead = new IRXLeadModel({
                                  "id":id,
                                  "projectId": lead.projectId,
                                  "agentId": users[i].irxId,
                                  "name": lead.name,
                                  "propertyType":lead.propertyType,
                                  "bhk":lead.bhk,
                                  "action":lead.action,
                                  "origin":lead.origin,
                                  "mobileNo":lead.mobileNo,
                                  "emailId": lead.emailId,
                                  "irxId" : lead.irxId,
                                  "type": lead.type,
                                  "createdOn": new Date(),
                                  "projectName":lead.projectName,
                                  "status":CONSTANTS.him_constants.USER_STATUS.PENDING_VERFICATION,
                                  "localityId":lead.localityId,
                                  "locality":lead.locality
                                })
                                
                                  nLead.save(function(err,uLead){
                                    if(err){
                                     logger.log("error",err);
                                    }else{
                                      console.log("debug","lead has been updated for:"+uLead.agentId)
                                      logger.log("debug","lead has been updated for:"+uLead.agentId);
                                    }
                                  })
                              new emailUtils().sendEmail("leads",locals,function(error,success){
                                if(error != null){
                                   logger.log("error",error);
                                }else if(success != null){
                                   logger.log("debug",success);
                                  console.log(success)
                                }
                              });
                            }
                          }
                        })
                        }
                       
                    })
                  }
                 
                }
                
              }
            })
          
        }else if(messageData.action == MAIL_TYPE.INVITATION){
          
            var locals =messageData.data;
            locals.userId=messageData.data.targetId;
              new emailUtils().sendEmail("invitation",locals,function(error,success){
                if(error != null){
                  console.error(error);
                }else if(success != null){
                  console.log(success)
                }
              });
        }else if(messageData.action == MAIL_TYPE.CLAIM_PROFILE){
          
            var locals ={
              "subject":properties.claim_profile_subject,
              "userId":properties.irx_agent,
              "claimerName":messageData.claimerName,
              "profileId":messageData.profileId
            }
              new emailUtils().sendEmail("claim-profile",locals,function(error,success){
                if(error != null){
                  console.error(error);
                }else if(success != null){
                  console.log(success)
                }
              });
        }
      }
    }
    sqs.deleteMessage({
                "QueueUrl" : sqsQueueUrl,
                "ReceiptHandle" :data.Messages[0].ReceiptHandle
              }, function(err, data){                
              });
      
   
   }
  
 }
 catch(e) {
  console.log(e)
}
queueReciever();
});
  }
queueReciever();