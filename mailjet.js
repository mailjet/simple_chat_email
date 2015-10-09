// mailjet.js
var Client = require('node-rest-client').Client;
var cred = require("./cred.js");

// configure basic http auth for every request 
var options_auth={user:cred.MAILJET_API_KEY,password:cred.MAILJET_SECRET_KEY};
client = new Client(options_auth);


myFunctions = {
	sendEmail : function(from, fromName, to, replyto, subject, html){
		var args = {
			data: {
				"FromEmail": from,
				"FromName": fromName,
				"Subject": subject,
				"Html-part": html,
				"Sender": "kikou@lol.fr",
				"Recipients":[{"Email":to}],
				"Headers" :{"Reply-To":replyto}
			},
			headers:{"Content-Type": "application/json"} 
		};
		// client.post("https://api.mailjet.com/v3/send", args, function(data, response){
		//     // // parsed response body as js object 
		//     // console.log(data);
		//     // // raw response 
		//     // console.log(response);
		// });
	}
	
}

module.exports = myFunctions;