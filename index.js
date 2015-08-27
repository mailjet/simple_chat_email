var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");


var Firebase = require("firebase");
var fb = new Firebase("https://chat-email.firebaseio.com/");

var mailjet = require("./mailjet.js");

app.use(express.static('public'));
var jsonParser = bodyParser.json();

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/parse/', jsonParser, function (req, res) {

	var message = {
		type : "email",
		email : req.body.Headers.From,
		to : req.body.Headers.To,
		subject : req.body.Subject,
		date : req.body.Headers.Date,
		text : req.body["Text-part"]
	}

	fb.push(message);
	res.sendStatus(200);

	console.log("------NEW MESSAGE FROM EMAIL------");
	console.log(message);
	console.log("----------------------------------");
});

fb.endAt().limitToLast(2).on("child_added", function(snapshot, prevChildKey) {
	var newVal = snapshot.val();
	if (newVal.type != "email") {
		var from = newVal.name+"@sharma.fr";
		var fromName = newVal.name;
		var subject = "You have a new message from " + newVal.name +"!"
		var to = "shubham@mailjet.com";
		var replyto = "11Yl-9lNpPahM7Pt@parse-in1.mailjet.com";
		var content = newVal.text + "\n\n----- reply after this line -----";
		//mailjet.sendEmail(from, fromName, to, replyto, subject, content);

		console.log("------NEW MESSAGE FROM INTERFACE------");
		console.log("sending email -> ", fromName, from, replyto, to, subject, content);
		console.log("--------------------------------------");
  }
});

var server = app.listen(1337, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

