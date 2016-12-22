var query  = require('./models/queries');
var path 	   = require('path');
var User 	 	 = require( path.resolve( __dirname, './models/Users' ) );
var Chatroom = require( path.resolve( __dirname, './models/Chatrooms' ) );


function configureClient(user, client) {
	if (user.username) {		
		client.room = user.chatroom;
		client.join(client.room);										
		client.emit('userJoin', {
			user: user.username,
			room: user.room
		});
		client.broadcast.to(client.room).emit('alert', user.username + ' has joined us!');		
	} 
};

function createChatroomCallback(error, chatroom, connectedUser, client, rooms, activeUsers) {
	
	if (error) console.log('Creating ' + connectedUser.chatroom + ' failed');								
	
	if (chatroom.name) {		
		rooms.push(chatroom.name);
		query.createUser(connectedUser.name, chatroom, function(err, user) {
			createUserCallback(err, user, chatroom, client, activeUsers);
		});
	}
};

module.exports = function(io){
	
	var activeUsers = {};	
	var rooms = [];
	
	io.on('connection', function(client) {		
		client.on('join', function(connectedUser) {			
			console.log(connectedUser + ' connected');
			if (connectedUser.chatroom) {				
				Chatroom
					.findIfExists(connectedUser.chatroom)
						.then(function(chatroom) {		
							console.log(chatroom + 'found');								
							if (chatroom) {						
								User
									.create({ 
										username: connectedUser.name, 
										chatroom: chatroom
									})
										.then(configureClient(user,client))
										.catch(function() {
											console.log('Creating new user failed.');										
										});								
								activeUsers[client.id] = connectedUser.name;
							}					
						})
						.catch(function() {
							console.log('Finding ' + connectedUser.chatroom + ' failed');
							Chatroom
								.create({name : connectedUser.chatroom})
									.then(function(chatroom) {
										User
											.create({ 
												username: connectedUser.name, 
												chatroom: chatroom
											})
												.then(configureClient(user,client))
												.catch(function() {
													console.log('Creating new user failed.');										
												});								
										activeUsers[client.id] = connectedUser.name;	
									})
									.catch(function() {
										console.log('Creating chatroom failed');
									});
						});
			}
		});

		client.on('message', function(data) {			
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