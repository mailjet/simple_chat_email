/** @jsx React.DOM */
var MessageList = React.createClass({
	render: function() {
		var _this = this;
		var createItem = function(item, index) {
			return (
				<li key={ index }>
				<strong className='example-chat-username'> {item.name} </strong>
				<strong className='example-chat-email'> {item.email} </strong>
				{ item.text }
				</li>
			);
		};
		return (
			<ul id='example-messages' className="example-chat-messages">
				{ this.props.items.map(createItem) }
			</ul>
		);
	}
});

/** @jsx React.DOM */
var InfoInput = React.createClass({
	render: function() {

		return (
			<div>
				
			</div>
			);
	}
});

var MessageSystem = React.createClass({
	getInitialState: function() {
		return {
			items: [],
			text: '',
			name: '',
		    email: ''
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

	onChangeText: function(e) {
		this.setState({
			text: e.target.value
		});
	},

	onChangeEmail: function(e) {
		this.setState({
			email: e.target.value
		});
	},

	onChangeName: function(e) {
		this.setState({
			name: e.target.value
		});
	},

	handleSubmit: function(e) {
		e.preventDefault();
		if (this.state.text && this.state.text.trim().length !== 0) {
		    elt = {
		      name:this.state.name,
		      email:this.state.email,
		      text:this.state.text,
		      type:"client"
		    }
			this.firebaseRef.push(elt);
			this.setState({
		      name:'',
		      email:'',
		      text:'',
		      type:''
			});
		}
	},

	render: function() {
		return (
			<div className="example-chat l-demo-container">

				<form onSubmit={ this.handleSubmit }>
					<header>Email Based chat</header>
					<div className='example-chat-toolbar'>
						<label htmlFor="nameInput">User :</label>
						<input 
							type='text' 
							id='nameInput'
							placeholder='enter your name here...' 
							onChange={ this.onChangeName } 
							value={ this.state.name } 
						
						/>
					</div>


					<div className='example-chat-toolbar'>
						<label htmlFor="emailInput">Email :</label>
						<input 
							type='text' 
							id='emailInput' 
							placeholder='enter an email adresse...' 
							onChange={ this.onChangeEmail } 
							value={ this.state.email } 
							
						/>
					</div>	


					<MessageList items={ this.state.items }/>


					

					<footer>
						<input 
							type='text' 
							id='messageInput'  
							placeholder='Type a message...' 
							onChange={ this.onChangeText } 
							value={ this.state.text } 
						/>
					</footer>
					<button>I am not going to be displayed</button>
				</form>
			</div>

			);
	}
});

React.render(<MessageSystem />, document.getElementById('content'));