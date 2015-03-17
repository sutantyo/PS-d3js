var pg = require('pg');
var fs = require('fs');

var connectionString = "postgres://daniels:macquarie@localhost/crawdad";
//var client = new pg.Client(conString);

pg.connect(connectionString, function(err,client,done){
  if(err) {
    return console.error('could not connect to postgres', err);
  }

	client.query("CREATE TABLE IF NOT EXISTS taxi_roma (id smallint, date date, time time, x decimal, y	decimal);", function(err,result){
		done();
	});

	fs.readFile('taxi_february_1','utf-8',function(err,data){
		if(err) {
			return console.error('error opening file', err);
		}
		var lines = data.split('\n');
		lines.forEach(function(line){
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
				});
			}
			else
			{
				console.log(line + "Done");
			}
		});
	});


	/*j
	//client.query("INSERT INTO taxi_roma VALUES (311, '2014-02-01', '00:42:05', 41.9323958113331, 12.5121819680059)", function(err,result){
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
		done();
  });
	*/
});

