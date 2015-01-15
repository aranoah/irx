/***********************************************************************
*
* DESCRIPTION :
*       Mongoose related configurations. Mongoose will act as ORM 
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
module.exports = function(done) {
  
    this.mongoose = require('mongoose');
    
 switch (this.env) { 
    case 'development':
      this.mongoose.connect('mongodb://122.176.200.133:27017/IRX');
      break;
    case 'production':
      this.mongoose.connect('mongodb://122.176.200.133:27017/IRX');
      break;
  }
   
var _self = this;
this.mongoose.getObjectId=function(id){
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    var ObjectId = require('mongodb').ObjectID;
    if(checkForHexRegExp.test(id)){
      return new ObjectId(id);
    }else{
      return id;
    }
};

this.mongoose.getCollection = function(dbName){
  return _self.mongoose.connection.collection(dbName);
}

/**** Add schema here ****/

    done();
}