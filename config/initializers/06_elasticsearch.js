module.exports = function(done) {
	this.elasticsearch = require('elasticsearch');
	_app_context.esClient = new this.elasticsearch.Client({
	  host: 'localhost:9200',
	  log: 'trace'
	});
	done();
}
