// mailjet.js
var Client = require('node-rest-client').Client;

myFunctions = {
	sendEmail : function(MAILJET_API_KEY, MAILJET_SECRET_KEY, from, fromName, to, replyto, subject, html){
		// configure basic http auth for every request 
		
		var options_auth={user:MAILJET_API_KEY,password:MAILJET_SECRET_KEY};
		client = new Client(options_auth);
		var args = {
			data: {
				"FromEmail": from,
				"FromName": fromName,
				"Subject": subject,
				"Html-part": html,
				"Recipients":[{"Email":to}],
				"Headers" :{"Reply-To":replyto}
			},
			headers:{"Content-Type": "application/json"} 
		};
		client.post("https://api.mailjet.com/v3/send", args, function(data, response){
		    // Here is the email being sent via the Mailjet's Parse API using the user API keys.
		    console.log(response.statusCode);
		});
	}
	
}

module.exports = myFunctions;