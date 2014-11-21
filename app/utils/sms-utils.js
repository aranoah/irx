/***********************************************************************
*
* DESCRIPTION :
*       SMS Utilities 
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
var http = require('http');
var properties = require(_path_env+'/properties');
//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'

function SMS_UTILS(){

}
SMS_UTILS.prototype.sendSms=function(smsMessage){
    console.log("send sms")
    
    var callback = function(response) {
      console.log("callback")
      var str = ''
      response.on('data', function (chunk) {
       str += chunk;
      });

      response.on('end', function () {
        console.log(str);
      });
   
    }
     var message ="username=" + properties.sms_username
            + "&password=" + properties.sms_password + "&destination="+smsMessage.phoneNo
            + "&message="+encodeURIComponent(smsMessage.msg)
            + "&source=" + properties.sms_senderId + "&type=" + 0 + "&dlr=1" ;
    var options = {
      host: properties.sms_host,
      path: properties.sms_path,
      method:properties.sms_req_type,
      port:properties.sms_port
    };

    try{
      console.log("try block")
      var req = http.request(options, callback).on('error',function(e){
        console.log("Error: "+ "\n" + e.message); 
        console.log( e.stack );
      });
     
      //This is the data we are posting, it needs to be a string or a buffer
      req.write(message);
      req.end();
      }catch (e){
        console.log("catch block")
        console.log(e)
      }
}
module.exports =  SMS_UTILS ;

