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
				$scope.user = user.user;
				$scope.room = user.room;				
			}
		});
		
		$scope.$on('socket:alert', function(event, alertMessage) {			
			if (alertMessage != '') {
				$scope.alert = alertMessage;								
			}
		});

		$scope.$on('socket:messageUpdate', function(event, data) {
			if (data.user === $scope.user) {
				console.log(data);
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
				console.log($scope.user);
				$scope.message = '';
			}
		}; 

	}]);