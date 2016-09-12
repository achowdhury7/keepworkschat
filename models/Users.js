var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
	chatroom: [{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Chatroom' 
	}]
},
{
	timestamps: true
});

module.exports = mongoose.model('User', UserSchema);