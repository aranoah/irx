/* Copyright (C) aranoah technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by varun.sharma@aranoah.com, Nov 2014
 */
var EventEmitter = require('events').EventEmitter;
function HIM_CONSTANTS(){    
  this.HIM_STORE="123";
 
}
var STATUS={
  CLIENT_ERROR:{code:400,msg:"Client Error"} ,
  SERVER_ERROR:{code:500,msg:"Server Error"} ,
  OK:{code:0,msg:"Ok"} ,
  NO_UPDATION:{code:22,msg:"Not Updated"} 
    
};
HIM_CONSTANTS.prototype.defaultPage = function (start,pageSize){
	var mStart=0;
	var mPageSize = 10;
	if(start != null && typeof(start) !="undefined"){
		mStart = Number(start);
	}
	if(pageSize != null && typeof(pageSize) !="undefined"){
		mPageSize = Number(pageSize);
	}
    var page ={start:mStart,pageSize:mPageSize,hasMore:false};
    return page;
}
HIM_CONSTANTS.prototype.applyPagination=function(q,page){
    if(page==null || typeof(page) == "undefined"){
       page = this.defaultPage();
    } else if(page.start==null || typeof(page.start) == "undefined" || page.pageSize==null || typeof(page.pageSize) == "undefined"){
       page = this.defaultPage();
    }
    q.skip(page.start).limit(page.pageSize+1);
    return page;
}

HIM_CONSTANTS.prototype.processResult=function(result,page){
  console.log(page);
    var hasMore = false;
    if(result.length>page.pageSize){
      hasMore=true;
      page.hasMore = true;
      result.splice(result.length-2,1);
    }
    return hasMore;
};

HIM_CONSTANTS.prototype.processPageResultJson=function(result,page){
  console.log("processPageResultJson",result,result.length,page);
    page.hasMore = false;
    if(result.length>page.pageSize){
      page.hasMore = true;
      result.splice(result.length-2,1);
    }
    return page;
};
HIM_CONSTANTS.prototype.executor=function(obj,func){
    return new HEventEmitter(obj,func);
}
function HEventEmitter(obj,func){
   EventEmitter.call(this);
   this.refObj = obj[func];
}
HEventEmitter.prototype.__proto__ = EventEmitter.prototype;
HEventEmitter.prototype.constructor = HEventEmitter;
HEventEmitter.prototype.exec=function(){
   var args=[];
   for(var i=0;i<arguments.length;i++){
      args[i] = arguments[i];
   }
   args[arguments.length]=this;
   this.refObj.apply(null,args);
}
exports.him_constants = new HIM_CONSTANTS() ;
exports.him_status = STATUS;
