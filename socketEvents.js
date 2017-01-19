var query  = require('./models/queries');
var path 	   = require('path');
var User 	 	 = require( path.resolve( __dirname, './models/Users' ) );
var Chatroom = require( path.resolve( __dirname, './models/Chatrooms' ) );


function configure(client, clientArray) {
	return user => {
		console.log(user.username);
		console.log(user.chatroom);
		if (user.username) {		
			client.room = user.chatroom;
			client.join(client.room);										
			client.emit('userJoin', {
				user: user.username,
				room: user.chatroom
			});
			client.broadcast.to(client.room).emit('alert', user.username + ' has joined us!');	
			clientArray[client.id] = user.username;				
		}	
	}	 
}

function createUser(username) {	
	return (chatroom) => {
		console.log(chatroom + ' found');
		return User
			.create({ 
				username: username, 
				chatroom: chatroom
			});			
	};						
} 

function createChatroom(chatroom) {
	return Chatroom
		.create({
			name : chatroom
		})
			.then(chatroom => console.log(chatroom));
}

function reportError(error) {
	console.log('failure callback:\n' + error);
};

module.exports = function(io) {
	
	var activeUsers = {};	
	var rooms = [];
	
	io.on('connection', function(client) {		
		client.on('join', function(connectedUser) {			
			//console.log(connectedUser.name + ' connected');
			if (connectedUser.chatroom) {											
				var createUserInRoom = createUser(connectedUser.name);
				var configureUser = configure(client, activeUsers);
				Chatroom
					.findIfExists(connectedUser.chatroom)
						.then(chatroom => {
							if(chatroom) {
								createUserInRoom(chatroom)
									.then(configureUser);
							} else {
								createChatroom(connectedUser.chatroom)
									.then(createUserInRoom)
										.then(configureUser);
							}
						})
						.catch(reportError);					
						
			}
		});

		client.on('message', function(data) {			
			console.log(data);
			io.sockets.in(data.room).emit('messageUpdate', {
				message: data.message,
				user: data.user
			});
		});

		client.on('disconnect', function() {
			client.broadcast.to(client.room).emit('alert', activeUsers[client.id].username + ' has left the room');
			client.leave(client.room);
			delete activeUsers[client.id];
		});
	});

};