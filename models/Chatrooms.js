var mongoose = require('mongoose');

var ChatroomSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		dropdups: true
	}},
	{
		timestamps: true	
});

ChatroomSchema.statics.findIfExists = function(name) {
		return mongoose.model('Chatroom')
			.findOne({ name: name })
				.lean()
				.exec();
	};

module.exports = mongoose.model('Chatroom', ChatroomSchema);
