var path 	   = require('path');

var User 	 	 = require( path.resolve( __dirname, './Users' ) );
var Chatroom = require( path.resolve( __dirname, './Chatrooms' ) );

module.exports= {
	createUser: function(username, chatroom, callback) {
		var newUser = new User({
			username: username,
			chatroom: chatroom
		});

		newUser.save(function(err, user) {
			if(err) return callback(err, null);
			callback(null, user);
		});
	},

	createChatroom: function(name, callback) {
		var newChatroom = new Chatroom({
			name: name
		});

		newChatroom.save(function(err, chatroom) {
			if(err) return callback(err, null);
			callback(null, chatroom);
		});
	},

	checkExistsChatroom: function(name) {
		return Chatroom
						.findOne({ name: name })
						.lean()
						.exec();
	}
};



