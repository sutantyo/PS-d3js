// Code stolen from https://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

var fs = require('fs');
var liner = require('./liner');
var source = fs.createReadStream('./taxi_february.txt');
var destination = fs.createWriteStream('./taxi_february.csv');

source.pipe(liner);
liner.on('readable',function(){
	var line;
	while (line = liner.read()) {
		parts = line.split(';');
		var id = parts[0];
		var datetime = parts[1].substring(0,19).split(' ');
		var startBracket = parts[2].indexOf('(')+1;
		var endBracket 	 = parts[2].lastIndexOf(')');
		var xy = parts[2].substring(startBracket,endBracket).split(' ');
		
		//console.log(id + ';' + datetime[0] + ';' + datetime[1] + ';' + xy[0] + ';' + xy[1]);
		destination.write(id + ',' + datetime[0] + ',' + datetime[1] + ',' + xy[0] + ',' + xy[1] + '\n');
	}
});
