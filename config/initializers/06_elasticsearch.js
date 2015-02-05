/***********************************************************************
*
* DESCRIPTION :
*      Elasticsearch realted configurations.
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		11 Nov 2014
*
* CHANGES :
*
**/
module.exports = function(done) {
	this.elasticsearch = require('elasticsearch');
	
	try{
		_app_context.esClient = new this.elasticsearch.Client({
<<<<<<< HEAD
			host: 'localhost:9200',
=======
			host: '122.176.232.0:9200',
>>>>>>> 41d89dbf486d53bb1202bce9d05aca8982040fb0
			log: 'trace'
		});
	}
	catch(e){
		console.log(e);
	}
	done();
}
