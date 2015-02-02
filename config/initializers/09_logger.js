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
	var winston = require('winston');
   var logger= new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: 'info' }),
      new (winston.transports.File)({ filename: '/Users/aniyus/workspace/IRX/irx/irx.log'})
    ]
    });
	try{
          logger.transports.console.level = 'debug';
          logger.transports.file.level = 'verbose';
		_app_context.logger = logger;

	}
	catch(e){
		console.log(e);
	}
	done();
}