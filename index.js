var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");


var Firebase = require("firebase");
var fb = new Firebase("https://chat-email.firebaseio.com/");
var last = "None";

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

var lastUserEmail = "none";
var currentUserEmail = "none2";

fb.endAt().limitToLast(1).on("child_added", function(snapshot, prevChildKey) {
	var newVal = snapshot.val();
	if (newVal.type != "email") {
		last = newVal.email;
		var from = newVal.email;
		var fromName = newVal.name;
		var subject = "You have a new message from " + newVal.name +"!"

		currentUserEmail = newVal.email;
		var to = lastUserEmail;

		if (lastUserEmail != currentUserEmail)
			lastUserEmail = currentUserEmail;

		var replyto = "11Yl-9lNpPahM7Pt@parse-in1.mailjet.com";
		var content = newVal.text + "\n\n----- reply after this line -----";
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

var server = app.listen(1339, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});


