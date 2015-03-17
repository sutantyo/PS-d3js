var express = require('express');
var morgan = require('morgan');

var app = express();

app.set('port',(process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get(['/','/home'], function(request,response){
	response.render('index',
		{ title : 'Home' }
	);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
