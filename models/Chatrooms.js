var mongoose = require('mongoose');

var ChatroomSchema = new mongoose.Schema({
	name: {	type 	 : String,
			unique 	 : true,
			dropdups : true }
});

module.exports = mongoose.model('Chatroom', ChatroomSchema);