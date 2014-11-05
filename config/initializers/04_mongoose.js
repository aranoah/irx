module.exports = function(done) {
  
    this.mongoose = require('mongoose');
    
 switch (this.env) {
    case 'development':
      this.mongoose.connect('mongodb://localhost:27017/hereiam');
      break;
    case 'production':
      this.mongoose.connect('mongodb://localhost:27017/hereiam');
      break;
  }
   
var _self = this;
this.mongoose.getObjectId=function(id){
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    var ObjectId = _self.mongoose.Schema.ObjectId;
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