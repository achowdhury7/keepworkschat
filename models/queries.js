var path 	 = require('path');

var User 	 = require( path.resolve( __dirname, "./Users" ) );
var Chatroom = require( path.resolve( __dirname, "./Chatrooms" ) );

module.exports.createUser = function(username, chatroom, cb) {
	var newUser = new User({
		username : username,
		chatroom : chatroom
	});

	newUser.save(cb);
};

module.exports.createChatroom = function(name, cb) {
	var newChatroom = new Chatroom({
		name : name
	});

	newChatroom.save(cb);
};

module.exports.checkExistsChatroom = function(name, cb) {
	Chatroom
		.find({name:name})
		.exec(cb);
};


