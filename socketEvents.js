var query  = require('./models/queries');

function createUserCallback(error, newUser, chatroom, client, activeUsers) {
	
	if (error) console.log('Creating new user failed.');	

	if (newUser.username) {
		activeUsers[client.id] = newUser;		
		client.room = chatroom.name;
		client.join(client.room);
		client.username = newUser.username;		
		client.emit('userJoin', {
			user: client.username,
			room: client.room
		});
		client.broadcast.to(client.room).emit('alert', client.username + ' has joined us!');		
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
			if (connectedUser.chatroom) {				
				query.checkExistsChatroom(connectedUser.chatroom, function(error, chatroom) {										
					
					if (error) console.log('Finding ' + connectedUser.chatroom + ' failed');
					
					if (chatroom) {						
						query.createUser(connectedUser.name, chatroom, function(error, user) {
							createUserCallback(error, user, chatroom, client, activeUsers);	
						});
					} else {						
						query.createChatroom(connectedUser.chatroom, function(error, chatroom) {
							createChatroomCallback(error, chatroom, connectedUser, client, rooms, activeUsers);
						});
					}
					
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