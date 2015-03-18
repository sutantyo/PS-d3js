var pg = require('pg');
var async = require('async');

var connectionString = "postgres://daniels:macquarie@localhost/crawdad";
//var client = new pg.Client(conString);

pg.defaults.poolsize = 25;
pg.defaults.poolIdleTimeout = 60000;
pg.connect(connectionString, function(err,client,done){
  if(err) {
    return console.error('could not connect to postgres', err);
  }

	client.query("DROP TABLE IF EXISTS testDB", function(err,result){
		if (err){
			return console.error ('Error dropping table', err)
		}
	});
	client.query("CREATE TABLE IF NOT EXISTS testDB (id int, first int, second int)", function(err,result){
		if (err){
			return console.error ('Error creating table', err)
		}
	});
	done();

	var entries = new Array(100);
	for (i = 0; i < 100000; i++){
		//console.log("INSERT INTO testDB VALUES (" + i.toString() + "," + (10000-i).toString() + "," + i.toString() + ")");
		entries[i] = "INSERT INTO testDB VALUES (" + i.toString() + "," + (10000000-i).toString() + "," + i.toString() + ")";
		/*client.query("INSERT INTO testDB VALUES (" + i.toString() + "," + (1000000-i).toString() + "," + (-i).toString() + ")", function(err,result){
			if (err) {
				return console.error('Error inserting query', err);
			}
			done();
		});
		*/
	}
	console.log("Finished populating array: " + entries[0] );

	async.each(entries, function(entry ,callback){
		//client.query("INSERT INTO testDB VALUES (" + i.toString() + "," + (1000000-i).toString() + "," + (-i).toString() + ")", function(err,result){
		client.query(entry, function(err,result){
			if (err) {
				return console.error('Error inserting query', err);
			}
			done();
		});
		callback();
	}, function(err){
		if (err) {
			console.log("Something went wrong");
		}
	});
});



