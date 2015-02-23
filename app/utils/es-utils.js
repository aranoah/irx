/***********************************************************************
*
* DESCRIPTION :
*       Utilities to index data in elastic search
*  
* Copyright :
*   Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*   Puneet (puneet@aranoah.com)      
*
* START DATE :    
*   11 Feb 2014
*
* CHANGES :
*/
var logger = _app_context.logger;

function ES_UTILS(){

}

ES_UTILS.prototype.indexUser=function(user){
	console.log("index user")
		logger.log("debug","index user")
_app_context.esClient.index({
		  index: 'irx_schema',
		  type: 'irx-euser',
		  id: user.irxId,
		  body: {
		    name: user.name,
		    userId: user.irxId,
		    location: user.locationMapper
		  }
		}, function (err, resp) {
		 if(err){
		 	logger.log("error",err)
		 }
		 if(resp){
		 	logger.log("debug",resp)
		 }
		});
}

module.exports =  ES_UTILS ;