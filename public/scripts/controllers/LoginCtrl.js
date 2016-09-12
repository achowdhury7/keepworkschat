angular
	.module('chat')
	.controller('LoginCtrl', ['$scope', 'chatSocket', function($scope, chatSocket) {		
		
		$scope.submit = function() {
			if ($scope.user.name) {
				chatSocket.emit('join', $scope.user);				
			}
		};

	}]);