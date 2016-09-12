var query  = require('./models/queries');

function createUserCallback(error, newUser, client) {
	console.log('createUserCallback entered')
	if (error) {
		console.log('Creating new user failed.');
	}

	if (newUser.username) {
		console.log(newUser.username + ' created');
		client.join(newUser.chatroom);
		console.log(newUser.username + ' has joined ' + newUser.chatroom);
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
						client.emit('Chatroom lookup error');						
					}
					if (chatroom.name) {
						console.log(chatroom.name + ' found');
						query.createUser(connectedUser.name, chatroom, function(err, user) {
							createUserCallback(err, user, client);	
						});
					} else {
						console.log(chatroom.name + ' not found');
						query.createChatroom(connectedUser.chatroom, function(error, chatroom) {
							if (error) {
								console.log('Creating ' + connectedUser.chatroom + ' failed');								
							}
							if (chatroom.name) {
								console.log(chatroom.name + ' created');
								query.createUser(connectedUser.name, chatroom, function(err, user) {
									createUserCallback(err, user, client);
								});
							}
						});
					}

				});
			}
		})
	});

};