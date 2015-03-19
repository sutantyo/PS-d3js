var pg = require('pg');
var fs = require('fs');
var async = require ('async');

var connectionString = "postgres://daniels:macquarie@localhost/crawdad";
//var client = new pg.Client(conString);

pg.defaults.poolsize = 25;

pg.connect(connectionString, function(err,client,done){
  if(err) {
    return console.error('could not connect to postgres', err);
  }
	
	async.series([
		function(callback){
			client.query("DROP TABLE IF EXISTS taxi_roma", function(err,result){
				if (err)
					return console.error('could not drop table', err);
				done();
				callback(null,'one');
			});
		},
		function(callback){
			client.query("CREATE TABLE IF NOT EXISTS taxi_roma (id smallint, date date, time time, x decimal, y	decimal)", function(err,result){
				if (err)
					return console.error('could not create table', err);
				else
					done();
					callback(null,'two');
			});
		},
		function(callback){
			fs.readFile('taxi_february_1','utf-8',function(err,data){
				if(err) 
					return console.error('error opening file', err);
		
				var lines = data.split('\n');
				async.eachSeries(lines, function(line,callback){
					if (line){
						parts = line.split(';');
						var id = parts[0];
						var datetime = parts[1].substring(0,19).split(' ');
						var startBracket = parts[2].indexOf('(')+1;
						var endBracket 	 = parts[2].lastIndexOf(')');
						var xy = parts[2].substring(startBracket,endBracket).split(' ');

								/*
								console.log("INSERT INTO taxi_roma VALUES (" + id + ", '" 
																															+ datetime[0] + "', '" 
																															+ datetime[1] + "', "
																															+ xy[0] + ", " 
																															+ xy[1] + ");");
								*/
						client.query("INSERT INTO taxi_roma VALUES (" + id + ", '" 
																															+ datetime[0] + "', '" 
																															+ datetime[1] + "', "
																															+ xy[0] + ", " 
																															+ xy[1] + ");", function(err,result){
								if(err)	{
									return console.error('Error inserting query', err);
								}	
								done();
								callback();
							});
						}
			  else
				{
					console.log(line + "Done");
					callback(null,'three');
				}
			});
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
		console.log("Series finished: " + results);
	});
});	




