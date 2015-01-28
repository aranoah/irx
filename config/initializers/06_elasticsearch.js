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
			host: '122.176.201.92:9200',
			log: 'trace'
		});

	}
	catch(e){
		console.log(e);
	}
	done();
}
