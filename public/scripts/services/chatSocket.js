angular
	.module('chat')
	.factory('chatSocket', function(socketFactory, settings) {
		return socketFactory({
			ioSocket : io.connect(settings.baseUrl + ':' + settings.port, {
				reconnection : false
			})
		});
	});
