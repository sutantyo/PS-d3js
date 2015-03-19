// Code mostly stolen from https://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

var fs = require('fs');
var stream = require('stream');
var liner = new stream.Transform( {objectMode: true} );

liner._transform = function(chunk,encoding,done){
	var data = chunk.toString();
	if (this._lastLineData) 
			data = this._lastLineData + data;
	
	var lines = data.split('\n');
	this._lastLineData = lines.convert()

	lines.forEach(this.push.bind(this))
		done()
}

var convert = function(){

}


var inputFile = fs.createReadStream('taxi_february_1');
var outputFile = fs.createWriteStream('taxi_february.csv');
file.pipe(newFile)

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
