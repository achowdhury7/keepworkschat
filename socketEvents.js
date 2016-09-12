var query  = require('./models/queries');

function createUserCallback(error, newUser, chatroom, client, activeUsers) {
	console.log('createUserCallback entered')
	if (error) {
		console.log('Creating new user failed.');
	}

	if (newUser.username) {
		activeUsers[client.id] = newUser;
		console.log(newUser.username + ' created');
		client.room = chatroom.name;
		client.join(client.room);
		console.log(newUser.username + ' has joined ' + client.room);
		client.emit('userJoin', {
			user: newUser.username,
			room: client.room
		});
		client.broadcast.to(client.room).emit('alert', newUser.username + ' has joined us!');		
	} 
};

module.exports = function(io){
	var activeUsers = {};	
	var rooms = [];
	io.on('connection', function(client) {
		console.log('user connected');
		client.on('join', function(connectedUser) {
			console.log(connectedUser.name + ' ' + connectedUser.chatroom);
			if (connectedUser.chatroom) {				
				query.checkExistsChatroom(connectedUser.chatroom, function(error, chatroom) {
					console.log('Checking if ' + connectedUser.chatroom + ' exists');
					if (error) {
						console.log('Finding ' + connectedUser.chatroom + ' failed');
						client.emit('Chatroom lookup error');						
					}
					if (chatroom) {
						console.log(chatroom.name + ' found');
						query.createUser(connectedUser.name, chatroom, function(err, user) {
							createUserCallback(err, user, chatroom, client, activeUsers);	
						});
					} else {
						console.log(connectedUser.chatroom + ' not found');
						query.createChatroom(connectedUser.chatroom, function(error, chatroom) {
							console.log('createChatroom callback entered')
							if (error) {
								console.log('Creating ' + connectedUser.chatroom + ' failed');								
							}
							if (chatroom.name) {
								console.log(chatroom.name + ' created');
								rooms.push(chatroom.name);
								query.createUser(connectedUser.name, chatroom, function(err, user) {
									createUserCallback(err, user, chatroom, client, activeUsers);
								});
							}
						});
					}

				});
			} else {
					console.log('No chatroom entered');
			}
		});
		client.on('message',function(data) {
			console.log(data.room);
			io.sockets.in(data.room).emit('messageUpdate', {
				message: data.message,
				user: data.user
			});
		});
		client.on('disconnect', function() {
			io.sockets.emit('alert', activeUsers[client.id].username + ' has left chat');
			client.leave(client.room);
			delete activeUsers[client.id];
		});
	});

};