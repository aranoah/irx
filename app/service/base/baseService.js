/***********************************************************************
*
* DESCRIPTION :
*       Base Service with common functionalities. Every other service
*       should extend this.
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

var himConstants = require(_path_util+'/constants');
var EventEmitter = require('events').EventEmitter;
var mongodb = require('mongodb');
BaseService.prototype.__proto__= EventEmitter.prototype ;
function BaseService(){
   
}
BaseService.prototype.processPagenation=function(result,page){
		if(result != null && result.length > page.pageSize){
				page.hasMore=true;
				result.pop();
			}else{
				page.hasMore=false;
			}

}
BaseService.prototype.getCustomMongoId = function(prefix) {
	 var ObjectId = mongodb.ObjectID;
	 return prefix+new ObjectId();
};
module.exports = BaseService;