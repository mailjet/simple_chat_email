/** @jsx React.DOM */
var MessageList = React.createClass({
	render: function() {
		var _this = this;
		var createItem = function(item, index) {
			return (
				<li key={ index }>
				<strong className='example-chat-username'> {item.name} </strong>
				<strong className='example-chat-email'> {"<"+item.email+">"} </strong>
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

var MessageSystem = React.createClass({
	getInitialState: function() {
		return {
			items: [],
			text: '',
			name: '',
		    email: '',
			key: '',
		    secret: ''
		};
	},

	componentWillMount: function() {
		this.firebaseRef = new Firebase('https://chat-email.firebaseio.com/');
		this.firebaseRefUsers = new Firebase('https://chat-email.firebaseio.com/users/');
		this.firebaseRef.limitToLast(10).on('value', function(dataSnapshot) {
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

	onChangeKey: function(e) {
		this.setState({
			key: e.target.value
		});
	},

	onChangeSecret: function(e) {
		this.setState({
			secret: e.target.value
		});
	},

	handleSubmit: function(e) {
		e.preventDefault();
		if (this.state.text && this.state.text.trim().length !== 0
			&& this.state.email && this.state.email.trim().length !== 0
			&& this.state.name && this.state.name.trim().length !== 0
			&& this.state.key && this.state.key.trim().length !== 0
			&& this.state.secret && this.state.secret.trim().length !== 0) {
		    elt = {
		      name:this.state.name,
		      email:this.state.email,
		      text:this.state.text,
		      type:"client"
		    };
			this.firebaseRef.push(elt);
			this.setState({
		      text:'',
		      type:''
			});
		}
	},

	render: function() {
		return (
			<div className="example-chat l-demo-container">

				<form onSubmit={ this.handleSubmit }>
					<header>A simple messaging app</header>
					<div className='toolbar-container'>
						<div className='example-chat-toolbar left-toolbar'>
							<label htmlFor="nameInput">API key :</label>
							<input 
								type='text' 
								id='keyInput'
								placeholder='your api key here' 
								onChange={ this.onChangeKey } 
								value={ this.state.key } 
							
							/>
						</div>


						<div className='example-chat-toolbar right-toolbar'>
							<label htmlFor="emailInput">API secret :</label>
							<input 
								type='text' 
								id='secretInput' 
								placeholder='your api secret key here...' 
								onChange={ this.onChangeSecret } 
								value={ this.state.secret } 
								
							/>
						</div>	

						<div className='example-chat-toolbar left-toolbar'>
							<label htmlFor="nameInput">User :</label>
							<input 
								type='text' 
								id='nameInput'
								placeholder='enter your name here...' 
								onChange={ this.onChangeName } 
								value={ this.state.name } 
							
							/>
						</div>


						<div className='example-chat-toolbar right-toolbar'>
							<label htmlFor="emailInput">Email :</label>
							<input
								type='text' 
								id='emailInput' 
								placeholder='enter an email adresse...' 
								onChange={ this.onChangeEmail } 
								value={ this.state.email } 
								
							/>
						</div>	
					</div>

					<MessageList items={ this.state.items }/>
					

					<footer>
						<input 
							type='text' 
							id='messageInput'  
							placeholder='Type a message... and ' 
							onChange={ this.onChangeText } 
							value={ this.state.text } 
						/>
					</footer>
					<button id="hidingbutton">I am not going to be displayed</button>
				</form>
			</div>

			);
	}
});

React.render(<MessageSystem />, document.getElementById('content'));