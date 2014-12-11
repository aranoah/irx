/***********************************************************************
*
* DESCRIPTION :
*      Common validation functionalities
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
var validator = require('validator');

function CommonValidator(req){
  this.errors=[];
  if(req){
     req["errors"] = this; 
  }
}
CommonValidator.prototype.validate=function(){

    var args=[];
    var n=0;
    var fieldName = arguments[0];
    var actions=arguments[1];
    var funName = actions[actions.length -1];
    

    for(var i=2;i<arguments.length;i++){
      args[n++] = arguments[i];
    }
    for(var i=0;i<actions.length-1;i++){
       if(actions[i]=="required" && (!arguments[2] || arguments[2] == null) ){
        this.errors.push(fieldName+" is required");
        return false;
      }
      
    }
   

    if(validator[funName] && !validator[funName].apply(null,args)){
        var label =funName;
        if(funName.indexOf("is")==0){
            label =funName.substring(2);
        }
        this.errors.push(fieldName+" is not valid "+label);
      return false;
    } else{
      return true;
    }
}
CommonValidator.prototype.hasError=function(){
  return this.errors.length>0;
}

CommonValidator.prototype.getErrors=function(){
  return this.errors;
}
module.exports = CommonValidator;