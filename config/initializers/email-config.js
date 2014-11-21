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
   service: "aranoah",
   host : "smtp.aranoah.com",
   secure :true,
   
   port:25,
   auth: {
       user: "him-mail@aranoah.com",
       pass: "Okn!)rP0"
    }
});
_app_context.emailSender= smtpTransport;  