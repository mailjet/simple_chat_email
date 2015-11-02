#Reply by email, simple messaging app

## What it is this about ?
You might know email service providers for their reputation of doing a great job of delivering your email, but did you know some also provide additional tools to set up “reply by email” systems?. 

This is a messaging app example which lets a group of people communicate together. If a user tagged in a message is currently offline, he’ll receive an email notification so that he won’t miss a beat and can reply (directly by email) even if they want to stay offline. 

This demo uses  Mailjet’s inbound processing API and some basic ReactJS and NodeJS code. Check out the app in 
Here is the blog post explaining what are the different use cases of this "reply by email" system.


## The online demo
You can test the demo on this link : https://reply-by-email-demo.mailjet.com/

##Installation process

###This app is buil on the top of the Mailjet's API. You will need
-	NodeJS and npm installed
-	Mailjet API Keys when you are going to use the app

###The followings packages are used listed in the package.json
-	body-parser
-	express
-	firebase
-	node-rest-client

###Here is what you need to type in your shell
```
$> git clone https://github.com/shubs/simple_chat_email
$> cd simple_chat_email
$> npm install
$> npm start
```

## The flow
```




							-----------------							-----------------
							|	ParseAPI 	|	<---(reply by emil)---	|   Your inbox	|
							-----------------							-----------------
									|											^
									|											|
							 (POST request)										|
									|											|
									|											|
									v 											|
===================			-----------------							-----------------
|Message interface| <---->	|	index.js 	|	---(sending email)-->	|	mailjet.js 	|
===================			-----------------							-----------------
									|
									|
								(updates)
									|
									|
									v
							-----------------
							|  Firebase db	|
							-----------------
```

### Message interface
This interface is visible on https://reply-by-email-demo.mailjet.com/
The goal of this interface is to let the user post a new message in the room and every messages are displayed in this interface.
All the code is located in public/js/appJSX.js 

### index.js (Express server)
There is an expressJS server running on index.js. This server is expecting a POST request from the Parse API
Otherwise it will render the file index.html if you perform a GET request on it.

### ParseAPI
This one is the inbound API of Mailjet. every single time that someone reply by email, a POST request is triggered with the content of the message and sent to index.js.

You need to configure the Parse API webhook. Here is a full guide which explains how to do it.

### Firebase Database
This database is keeping every messages of the chat and on every update of this list of message. it updates the Message interface.
There is no need to setup anything in this app as everything is handled by a allready configured database.

### mailjet.js (sending emails)
This module is using the Mailjet sendAPI to be able to send a message when a user is offline.


##(Low) hanging fruits
-	A real User system (with Google SSO for example)
-	User mention on the interface
-	A better design



