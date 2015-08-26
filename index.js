var express = require('express');
var app = express();
var path = require("path");


var Firebase = require("firebase");
var fb = new Firebase("https://chat-email.firebaseio.com/");


var mailjet = require("./mailjet.js");


app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname+'/index.html'));
});

// accept POST request on the homepage
app.post('/', function (req, res) {
  res.send('Got a POST request');
});

fb.endAt().limit(1).on("child_added", function(snapshot, prevChildKey) {
  var newVal = snapshot.val();
  console.log("SEND")
  console.log(newVal);
});

var server = app.listen(1337, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

