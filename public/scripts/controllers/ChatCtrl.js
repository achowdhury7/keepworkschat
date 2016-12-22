angular
	.module('chat')
	.controller('ChatCtrl', ['$scope', 'chatSocket', function($scope, chatSocket) {		
		
		$scope.messageList = [];
		
		chatSocket.forward('alert', $scope);
		chatSocket.forward('userJoin', $scope);
		chatSocket.forward('messageUpdate', $scope);
		chatSocket.forward('disconnection-update', $scope);
		
		$scope.$on('socket:userJoin', function(event, user) {
			if (user) {
				console.log(user);
				$scope.user = user.username;
				$scope.room = user.chatroom;				
			}
		});
		
		$scope.$on('socket:alert', function(event, alertMessage) {			
			if (alertMessage != '') {
				$scope.alert = alertMessage;								
			}
		});

		$scope.$on('socket:messageUpdate', function(event, data) {
			if (data.user === $scope.user) {
				data.user = 'Me';
			}	
			$scope.messageList.push(data);			
		});

		$scope.sendMessage = function() {
			if ($scope.message) {
				chatSocket.emit('message', {
					user: $scope.user,
					room: $scope.room,
					message: $scope.message
				});				
				$scope.message = '';
			}
		}; 

	}]);