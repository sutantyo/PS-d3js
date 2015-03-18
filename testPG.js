var pg = require('pg');
var async = require('async');

var connectionString = "postgres://daniels:macquarie@localhost/crawdad";
//var client = new pg.Client(conString);

pg.defaults.poolsize = 10;
pg.defaults.poolIdleTimeout = 60000;


pg.connect(connectionString, function(err,client,done){
  if(err) 
    return console.error('could not connect to postgres', err);
	else
		console.log("Connected to server");
	async.series([
		function(callback){
			client.query("DROP TABLE IF EXISTS testDB", function(err,result){
				if (err)
					return console.error('could not drop table', err);
				else
				{
					console.log("Dropped existing table ...");
					done();
					callback(null,'one');
				}
			});
		},
		function(callback){
			client.query("CREATE TABLE IF NOT EXISTS testDB (id int, first int, second int)", function(err,result){
				if (err)
					return console.error('could not create table', err);
				else
				{
					done();
					console.log("Created table ...");
					callback(null,'two');
				}
			});
		},
		function(callback){
			var entries = new Array(100000);
			for (i = 0; i < 100000; i++){
				entries[i] = "INSERT INTO testDB VALUES (" + i.toString() + "," + (10000000-i).toString() + "," + i.toString() + ")";
			}
			console.log("Populated entries ...");

			var j = 1;
			async.eachSeries(entries, function(entry,callback){
				client.query(entry, function(err,result){
					if (err){
						callback('Error inserting query', err);
						console.error('Error inserting query inside async.each', err);	
					}
					else
					{
						setTimeout(function(){
							console.log("About to insert");
							done();
							console.log("Inserted " + (j++).toString() + " row");
							callback();
						},100);
					}
				});
			}, function(err){
				if (err) {
					return console.error('Error inserting query', err);
				}
				else 
					callback(null,'three');
			});
		},
		function(callback){
			console.log("Closed connection");
			client.end();
			callback(null,'four');
		}
	],
	function(err,results){
		if(err){
			return console.error('error in series', err);
		}
		console.log("Series finisehd: " + results);
	});
});	
