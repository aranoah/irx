/***********************************************************************
*
* DESCRIPTION :
*      Utilities for emails
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		11 Nov 2014
*
* CHANGES :
*
**/
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var path           = require('path');
var  templatesDir   = _path_template;
var emailTemplates = require('email-templates');
var fs = require('fs');
function EMAIL_UTILS(){

}

EMAIL_UTILS.prototype.sendEmail=function(templateName,data,callback){
	console.log("Send Email Utils");
	emailTemplates(templatesDir, function(err, template) {
		if (err) {
    		console.log(err);
  		} else {
			// Send a single email
		    template(templateName, data, function(err, html, text) {
		      if (err) {
		        console.log(err);
		      } else {
			        _app_context.emailSender.sendMail({
					   	from: "him-mail@aranoah.com", // sender address
					   	to: data.userId, // comma separated list of receivers
					  	subject: data.subject, // Subject line
					   	//text: "Hello world ✔" ,// plaintext body
					   	html: html,
				         // generateTextFromHTML: true,
				        text: text
						}, function(error, response){
						   	if(error){
						       console.log(error);
						       callback(error,null);
						  	}else{
						       console.log("Message sent: " + response.message);
						       callback(null,response.message);
						   	}
					});
		      	}
		    });
		}
	})
}

EMAIL_UTILS.prototype.sendEmailWithAttachment=function(templateName,emailModel){
		console.log("Send Email with attachment Utils");
	emailTemplates(templatesDir, function(err, template) {
		if (err) {
    		console.log(err);
  		} else {
			// Send a single email
		    template(templateName, emailModel, function(err, html, text) {
		      if (err) {
		        console.log(err);
		      } else {
			        fs.readFile(emailModel.path, function (err, data) {
						_app_context.emailSender.sendMail(
						{       from: 'him-mail@aranoah.com',
						        to:emailModel.to,
						        subject:emailModel.subject,
						        body:'',
						        attachments : [{'filename': 'helloworld.txt','contents':data}]
						},function(error, response){
						   	if(error){
						       console.log(error);
						  	}else{
						       console.log("Message sent: " + response.message);
						   	}
					});
					})
		    }
		})
	}

})
}
module.exports =  EMAIL_UTILS ;
