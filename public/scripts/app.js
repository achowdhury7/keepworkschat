angular
	.module('chat', [
	  'ui.router',
	  'btford.socket-io'
	])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: './views/login.html',
				controller: 'LoginCtrl'
			})

			.state('chat', {
				url: '/chat',
				templateUrl: './views/chat.html',
				controller: 'ChatCtrl'
			});

		$urlRouterProvider.otherwise('login');	
	}]);