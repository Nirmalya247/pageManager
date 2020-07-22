var bodyParser = require('body-parser');
var express = require('express');
var serveStatic = require('serve-static');
var http = require('http');
var fs = require("fs");



var app = express();
app.use('/web', express.static('../web'));
//app.get('/test', serveTest);
app.all('/*', serveHtml);
http.createServer(app).listen(9603);

/*
function serveTest(req, res) {
	res.send('test');
}
*/

function serveHtml(req, res) {
	fs.readFile('../web/index.html', function(err, data) {
		if (err) { common.errorTEXT(req, res); return; }
		res.set("Content-Type", "html");
		res.send(data);
	});
}

console.log('path: localhost:9603');