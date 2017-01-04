// Contrôleur de la page des questions
app.controller('QuestionsCtrl', function($http, $interval, $timeout, $rootScope) {
	let ask = this;
	let maxTime = 7000;
	let maxQuestions = 5;
	ask.timer = 100;
	ask.score = 0;
	ask.questions = [];
	$rootScope.scoreIteration = 2;
	ask.view = false;

	// Récupération des questions et réponses
	$http.get('/question.json').then(function(data) {
		ask.questions = data.data;
		
		// Affichage de la première question
		let rand = Math.ceil(Math.random()*9);
		maxQuestions--;
		touillette(ask.questions[rand].reponses);
		ask.demand = ask.questions[rand].question;
		ask.answers = ask.questions[rand].reponses;
		ask.questions.splice(rand, 1);

		// Changement du score gagné à mi-temps
		var timeout = $timeout(ask.scoreTime, 3500);

		// Timer
		let interval = $interval(function() {
			ask.timer -= 100 / (maxTime / (1000/60));

			if(ask.timer <= 0) {
				ask.check('miss');
			}

		}, 1000/60);


		// Fonction submit
		ask.check = function(bool) {
			ask.timer = 100;
			$timeout.cancel(timeout);

			// Ajout du score
			if(bool == 'miss') {
				ask.score = ask.score - 2;
			} else if(!bool) {
				ask.score = ask.score - 1;
			} else if(bool) {
				ask.score = ask.score + $rootScope.scoreIteration;
			}

			// Vérification du nb de questions restantes
			if(maxQuestions <= 0){
				$interval.cancel(interval);
				ask.view = true;
				return;
			}
			// Reset du gain de score
			$rootScope.scoreIteration = 2;

			// Nouvelle question
			rand = Math.ceil(Math.random()*ask.questions.length-1);
			maxQuestions--;
			touillette(ask.questions[rand].reponses);
			ask.demand = ask.questions[rand].question;
			ask.answers = ask.questions[rand].reponses;
			ask.questions.splice(rand, 1);

			var timeout = $timeout(ask.scoreTime, 3500);
		}

	});


	// Modifier le score à mi-chemin du chrono
	ask.scoreTime = function() {
		$rootScope.scoreIteration = 1;
		console.log('Iteration triggered');
		return $rootScope.scoreIteration;
	}

	
}); // Fin controlleur

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

