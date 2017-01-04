// Contrôleur de la page des questions
app.controller('QuestionsCtrl', function($http, $interval, $timeout, $rootScope) {
	let ask = this;
	let intervalCount = 5;
	ask.score = 0;
	ask.questions = [];
	$rootScope.scoreIteration = 2;
	ask.view = false;

	// Récupération des questions et réponses
	$http.get('/question.json').then(function(data) {
		ask.questions = data.data;
		
		// Affichage de la première question
		let rand = Math.ceil(Math.random()*4);
		touillette(ask.questions[rand].reponses);
		ask.demand = ask.questions[rand].question;
		ask.answers = ask.questions[rand].reponses;
		ask.questions.splice(rand, 1);

		// Changement du score gagné à mi-temps
		$timeout(ask.scoreTime, 3500);

		// Affichage des questions suivantes au bout de 7s
		let timer = $interval(function() {
			// Reset de l'itération du score gagné
			$rootScope.scoreIteration = 2;
			
			rand = Math.ceil(Math.random()*ask.questions.length);
			touillette(ask.questions[rand].reponses);
			ask.demand = ask.questions[rand].question;
			ask.answers = ask.questions[rand].reponses;
			ask.questions.splice(rand, 1);
			console.log("Interval triggered");

			// Changement du score gagné à mi-temps
			$timeout(ask.scoreTime, 3500);
		}, 7000, 4);

		// Affichage des résultats à la fin des questions
		timer.then(function() {
			ask.view = true;
		});

	});

	// Fonction de vérification
	ask.check = function(bool) {
		if(bool) ask.score = ask.score + $rootScope.scoreIteration;
		else ask.score = ask.score - 1;
		console.log(ask.score);
	}

	// Modifier le score à mi-chemin du chrono
	ask.scoreTime = function() {
		$rootScope.scoreIteration = 1;
		console.log('Iteration triggered');
		return $rootScope.scoreIteration;
	}
	
});

// Mélanger les éléments de réponse
function touillette(array){
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
   }
    return array;
}

