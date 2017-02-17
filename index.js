var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var config = require("./config.js")

var Firebase = require("firebase");
// If you want to choose your owne database, make sure you change this firebase link
var fb = new Firebase(config.firebase_url);
var last = "None";

var mailjet = require("./mailjet.js");
app.use(express.static('public'));
var jsonParser = bodyParser.json();


// Here is the GET / Handeling to get message interface in index.html and js/appJSX.js
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname+'/index.html'));
});

var lastUserEmail = "none";
var currentUserEmail = "none2";

// This is waiting for a POST from the Parse API. Make sure you configured the webhook using the mailjet's API
app.post('/parse/', jsonParser, function (req, res) {

	currentUserEmail = req.body.Sender;
	console.log("currentUserEmail : " + currentUserEmail);

	// Parsing all the json information that we received
	var message = {
		type : "email",
		email : currentUserEmail,
		to : req.body.Headers.To,
		subject : req.body.Subject,
		date : req.body.Headers.Date,
		// We make sure that we are just taking the upper part of the message
		text : req.body["Text-part"].split("------------------------")[0]
	}
	if (lastUserEmail != currentUserEmail)
		lastUserEmail = currentUserEmail;

	// Pushing the message in the db
	fb.push(message);
	res.sendStatus(200);

	console.log("------NEW MESSAGE FROM EMAIL------");
	console.log(message);
	console.log("----------------------------------");
});

// Whenerver a new message is added in the db we trigger this
fb.endAt().limitToLast(1).on("child_added", function(snapshot, prevChildKey) {
	var newVal = snapshot.val();

	// if the message is added in the room via the interface we sends an email
	if (newVal.type != "email") {
		last = newVal.email;
		var from = newVal.email;
		var fromName = newVal.name;
		var subject = "[Simple message app] You have a new message from " + newVal.name +"!"

		currentUserEmail = newVal.email;
		var to = lastUserEmail;

		if (lastUserEmail != currentUserEmail)
			lastUserEmail = currentUserEmail;


		var replyto = "simple-email-demo@parse-in1.mailjet.com";
		var content = "------------------------<br>" + newVal.text;

		console.log("DUMP SENDMAIL" + newVal.key, newVal.secret, from, fromName, to, replyto, subject, content);

		mailjet.sendEmail(newVal.key, newVal.secret, from, fromName, to, replyto, subject, content);

		console.log("------NEW MESSAGE FROM INTERFACE------");
		console.log("sending email -> \nformName :", fromName);
		console.log("\t from " + from);
		console.log("\t reply to " + replyto);
		console.log("\t to " + to);
		console.log("\t subject " + subject);
		console.log("\t content " + content);
		console.log("--------------------------------------");
  }
});

// You can change the port of this server at your convinience
var server = app.listen(1339, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
