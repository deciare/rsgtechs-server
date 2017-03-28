var port = 3000;
var express = require('express');
var app = express();
var region = require('./routes/region');

app.get('/', function (req, res) {
	res.send('Application is running');
})

app.use('/region', region);

app.listen(port, function () {
	console.log("Listening on port", port);
})
