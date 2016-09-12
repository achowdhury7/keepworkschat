var query  = require('./models/queries');

function createUserCallback(error, newUser) {
	if (error) {
		console.log('Creating new user failed.');		
	}
	if (newUser) {
		console.log(newUser + ' created');
		client.join(newUser.chatroom);
		console.log(user.chatroom + ' joined');
		client.emit('existing users', activeUsers);
		activeUsers[client.id] = newUser;

	}	
};

module.exports = function(io){
	var activeUsers = {};	
	io.on('connection', function(client) {
		console.log('user connected');
		client.on('join', function(connectedUser) {
			console.log(connectedUser.name + ' ' + connectedUser.chatroom);
			if (connectedUser.chatroom && connectedUser.chatroom!= '') {
				query.checkExistsChatroom(connectedUser.chatroom, function(error, chatroom) {
					if (error) {
						console.log('Finding ' + connectedUser.chatroom + ' failed');						
					}
					if (chatroom.name) {
						console.log(chatroom.name + ' found');
						query.createUser(connectedUser.name, chatroom, createUserCallback);
					} else {
						query.createChatroom(connectedUser.chatroom, function(error, chatroom) {
							if (error) {
								console.log('Creating ' + connectedUser.chatroom + ' failed');								
							}
							if (chatroom.name) {
								console.log(chatroom.name + ' created');
								query.createUser(connectedUser.name, chatroom, createUserCallback);
							}
						});
					}

				});
			}
		})
	});

};