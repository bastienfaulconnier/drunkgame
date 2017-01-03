// Contrôleur de la page des questions
app.controller('QuestionsCtrl', function($http, $scope) {
	let ask = this;
	let score = 0;
	ask.questions = [];

	// Récupération des questions et réponses
	$http.get('/question.json').then(function(data) {
		let rand = Math.ceil(Math.random()*4);
		ask.questions = data.data;
		ask.demand = ask.questions[rand].question;
		ask.answers = ask.questions[rand].reponses;
	});

	// Filtre random pour ng-repeat
	ask.random = function() {
		return 0.5 - Math.random();
	}
	
});