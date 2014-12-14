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

HTTPUtils.prototype.post = function(uri,data,dataType,successCallback,errorCallback) {
	 $.ajax({
          url : uri,
          type : "POST",
          dataType : dataType,
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
var httpUtils = new HTTPUtils();