// mailjet.js
var Client = require('node-rest-client').Client;
var cred = require("./cred.js");

// configure basic http auth for every request 
var options_auth={user:cred.MAILJET_API_KEY,password:cred.MAILJET_SECRET_KEY};
client = new Client(options_auth);


myFunctions = {
	sendEmail : function(from, fromName, to, subject, text){
		var args = {
			data: {
				"FromEmail": from,
				"FromName": fromName,
				"Subject": subject,
				"Text-part": text,
				"Recipients":[{"Email":to}]
			},
			headers:{"Content-Type": "application/json"} 
		};
		client.post("https://api.mailjet.com/v3/send", args, function(data, response){
		    // // parsed response body as js object 
		    // console.log(data);
		    // // raw response 
		    // console.log(response);
		});
	}
	
}

module.exports = myFunctions;