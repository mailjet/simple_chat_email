/** @jsx React.DOM */
var MessageList = React.createClass({
  render: function() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <li key={ index }>
          { item.text }
        </li>
      );
    };
    return <ul>{ this.props.items.map(createItem) }</ul>;
  }
});

/** @jsx React.DOM */
var InfoInput = React.createClass({
  render: function() {

    return (
    <div>
      <div className='example-chat-toolbar'>
        <label for="nameInput">User :</label>
        <input type='text' id='nameInput' placeholder='enter your name here...'/>
      </div>


      <div className='example-chat-toolbar'>
        <label for="emailInput">Email :</label>
        <input type='text' id='emailInput' placeholder='enter an email adresse...'/>
      </div>
     </div>
   	);
  }
});

var MessageSystem = React.createClass({
  getInitialState: function() {
    return {
      items: [],
      text: ''
    };
  },

  componentWillMount: function() {
    this.firebaseRef = new Firebase('https://chat-email.firebaseio.com/');
    this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
      var items = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['.key'] = childSnapshot.key();
        items.push(item);
      }.bind(this));

      this.setState({
        items: items
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRef.push({
        text: this.state.text
      });
      this.setState({
        text: ''
      });
    }
  },

  render: function() {
    return (
      <div className="example-chat l-demo-container">
        <header>Email Based chat</header>
        <InfoInput/>
        <MessageList items={ this.state.items } removeItem={ this.removeItem } />
        <form onSubmit={ this.handleSubmit }>
          <input onChange={ this.onChange } value={ this.state.text } />
          <button>{ 'Add #' }</button>
        </form>
      </div>

    );
  }
});

React.render(<MessageSystem />, document.getElementById('content'));