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