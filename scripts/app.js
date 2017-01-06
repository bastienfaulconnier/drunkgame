// Création d'une application angular
let app = angular.module('UndrunkApp', ['ngRoute', 'ngStorage']);

// Configuration de l'application angular
app.config(function($routeProvider) {

	// Configuration des routes
	$routeProvider
		.when('/accueil', {
			templateUrl  : 'views/accueil.html'
		})
		.when('/scores', {
			templateUrl  : 'views/scores.html',
			controller   : 'ScoresCtrl',
			controllerAs : 'scores'
		})
		.when('/questions', {
			templateUrl  : 'views/questions.html',
			controller   : 'QuestionsCtrl',
			controllerAs : 'ask',
			resolve : {
				questions : function($http) {
					return $http.get('/question.json');
				}
			}
		})
		.otherwise({
			redirectTo	 : '/accueil'
		});

});
