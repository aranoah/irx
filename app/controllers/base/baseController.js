/***********************************************************************
*
* DESCRIPTION :
*       Base Controller with common functionalities. Every other controller
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
var locomotive = require('locomotive');
var himConstants = require(_path_util+'/constants');

function BaseController(autoHandleValidation){
    locomotive.Controller.call(this);
    var _autoHandleValidation = autoHandleValidation||false;
    this.herrors = null;
    this.before('*', function(next) {
      var methodName = "validate_"+this.__action;
      if(this[methodName]){
        if(!this[methodName]()){
            if(this._autoHandleValidation){
              this.handleValidationErr();
              return ;
            }
        }
      }
      next();
   });
};

BaseController.baseRealPath = "../../";
BaseController.prototype.__proto__=  locomotive.Controller.prototype;
BaseController.prototype.constructor = BaseController;

BaseController.prototype.addHError = function(key,msg){
    if(this.herrors==null){
        this.herrors =new Array();
    }
    this.herrors.push({field:key,msg:msg});
}

BaseController.prototype.handleValidationErr = function(isUi){
    if(this.herrors==null)
        return false;
    
    if(!isUi)
      this.processJson(himConstants.him_status.CLIENT_ERROR.code,himConstants.him_status.CLIENT_ERROR.msg,this.herrors,null);
    else{
       this.render("pages/error");   
    }
    return true;
};

BaseController.prototype.processJson=function(status,msg,result,page){
    this.res.json({"status":status,message:msg,result:result,page:page});   
};
BaseController.prototype.processTableJson=function(status,msg,result,total){
    this.res.json({"status":status,"message":msg,records:result,"total":total});   
};

module.exports = BaseController;