var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var emailUtils = require(_path_util+"/email-utils.js")
var emailController = new Controller();

var path           = require('path');
var  templatesDir   = _path_template;
var emailTemplates = require('email-templates');

emailController.validate_main=function(){
    /// this.req = request object, this.res = response object.
    console.log("inside validate");
    this.req.checkBody('email', 'Invalid email').notEmpty();    
    return false;
}
emailController.sendEmail = function(req) {
	console.log("Send Email in emailController");
	var locals = req.body;
	new emailUtils().sendEmailWithAttachment("test",locals);
}
// emailController.sendEmail=function(){
// 	console.log("Send Email");
// 	emailTemplates(templatesDir, function(err, template) {

//   if (err) {
//     console.log(err);
//   } else {

// // An example users object with formatted email function
//     var locals = {
//       email: 'mamma.mia@spaghetti.com',
//       name: {
//         first: 'Mamma',
//         last: 'Mia'
//       }
//     };

//     // Send a single email
//     template('test', locals, function(err, html, text) {
//       if (err) {
//         console.log(err);
//       } else {
//         _app_context.emailSender.sendMail({
// 	   	from: "him-mail@aranoah.com", // sender address
// 	   	to: "puneetsharma41@gmail.com", // comma separated list of receivers
// 	  	subject: "Hello ✔", // Subject line
// 	   	text: "Hello world ✔" ,// plaintext body
// 	   	html: html,
//          // generateTextFromHTML: true,
//         text: text
// 	}, function(error, response){
// 	   	if(error){
// 	       console.log(error);
// 	  	}else{
// 	       console.log("Message sent: " + response.message);
// 	   	}
// 	});
//       }
//     });
// }
// })
// }
module.exports = emailController;