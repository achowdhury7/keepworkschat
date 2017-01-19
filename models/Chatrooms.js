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
				.exec()
					.catch(error => Promise.reject(new Error('Find op failed because: \n' + error)));						
	};

module.exports = mongoose.model('Chatroom', ChatroomSchema);
