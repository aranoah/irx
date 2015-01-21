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
		host: '122.176.206.39:9200',
=======
		host: 'localhost:9200',
>>>>>>> 3de46c082a7ec206283010ec2a3fa2f28a2beecc
		log: 'trace'
		});

	}
	catch(e){
		console.log(e);
	}
	done();
}
