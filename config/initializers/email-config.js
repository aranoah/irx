/***********************************************************************
*
* DESCRIPTION :
*      Email Configurations
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
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "gmail",
   //host : "smtp.aranoah.com",
   // secure :true,
   
   // port:25,
   auth: {
       user: "lovetoleo.1986@gmail.com",
       pass: "lovetoleo"
    }
});
_app_context.emailSender= smtpTransport;  