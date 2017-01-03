// Contrôleur de la page des questions
app.controller('QuestionsCtrl', function($http, $timeout) {
	let ask = this;
	let score = 0;
	ask.questions = [];

	// Récupération des questions et réponses
	$http.get('/question.json').then(function(data) {
		ask.questions = data.data;
		console.log(ask.questions[1].question);
	});

});