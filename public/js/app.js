// CREATE A REFERENCE TO FIREBASE
var messagesRef = new Firebase('https://chat-email.firebaseio.com/');

// REGISTER DOM ELEMENTS
var messageField = $('#messageInput');
var emailField = $('#emailInput');
var nameField = $('#nameInput');
var messageList = $('#example-messages');

// LISTEN FOR KEYPRESS EVENT
messageField.keypress(function (e) {
  if (e.keyCode == 13) {
    //FIELD VALUES
    var username = nameField.val();
    var email = emailField.val();
    var message = messageField.val();

    //SAVE DATA TO FIREBASE AND EMPTY FIELD
    elt = {
      name:username,
      email:email,
      text:message,
      type:"client"
    }
    messagesRef.push(elt);
    messageField.val('');
  }
});

// Add a callback that is triggered for each chat message.
messagesRef.limitToLast(10).on('child_added', function (snapshot) {
  //GET DATA
  var data = snapshot.val();
  var username = data.name || "anonymous";
  var email = data.email || "anonymous@sharma.fr";
  var message = data.text;

  //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
  var messageElement = $("<li>");
  var nameElement = $("<strong class='example-chat-username'></strong>")
  var emailElement = $("<strong class='example-chat-email'></strong>")
  nameElement.text(username);
  emailElement.text(email);
  messageElement.text(message).prepend("> ").prepend(email).prepend("<").prepend(nameElement);

  //ADD MESSAGE
  messageList.append(messageElement)

  //SCROLL TO BOTTOM OF MESSAGE LIST
  messageList[0].scrollTop = messageList[0].scrollHeight;
});