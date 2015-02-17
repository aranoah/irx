function HTTPUtils(){

}

HTTPUtils.prototype.get = function(uri,data,dataType,successCallback,errorCallback) {
	 $.ajax({
          url : uri,
          type : "GET",
          dataType : dataType,
          data :data,
          success : function(data) { 
	          if(successCallback){
	          	successCallback(data);
	          }  
            
          },
          error: function(e,t,s){
          	if(errorCallback){
          		errorCallback(e,t,s);
          	}
          }
        })
};

HTTPUtils.prototype.post = function(uri,data,headers,dataType,successCallback,errorCallback) {
	 $.ajax({
          url : uri,
          type : "POST",
          dataType : dataType,
          headers: headers,
          data:data,
          success : function(data) { 
	          if(successCallback){
	          	successCallback(data);
	          }  
            
          },
          error: function(e,t,s){
          	if(errorCallback){
          		errorCallback(e,t,s);
          	}
          }
        })
};

HTTPUtils.prototype.checkStatus = function(data,showPopUpSuccess,showPopUpFail,successObj,failureObj) {
     if(data.status == 0 || data.status==200){

          if(showPopUpSuccess){
              if(!successObj){
                successObj={
                  status:data.status,
                  heading:"Operation Status",
                  content:data.message
                };
              }
             __overlaySideBar(successObj)
          }
          return true;
    }else{
          if(data.status==401){
            $('.log-in').click();
            return false;
          }
          if(showPopUpFail){
            if(!failureObj){
             failureObj={
              status:data.status,
              heading:"Operation Status",
              content:data.message 
            };
          }
            __overlaySideBar(failureObj)
              
          }
        return false;
     }
};
var httpUtils = new HTTPUtils();