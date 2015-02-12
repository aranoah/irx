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

HTTPUtils.prototype.checkStatus = function(data,showPopUp) {
     if(data.status == 0 || data.status==200){

          if(showPopUp){
               $('#_serverSuccess_').modal('show');
          }
          return true;
    }else{
     
        $('#_serverError_').modal('show');
        $('#_serverError_').find('.errMsg').text(data.message)
     }
};
var httpUtils = new HTTPUtils();