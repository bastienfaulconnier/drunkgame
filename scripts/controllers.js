// Contrôleur de la page des scores
app.controller('ScoresCtrl', function($localStorage) {
	let scores = this;
	scores.players = $localStorage.players;
});

// Contrôleur de la page des questions
app.controller('QuestionsCtrl', function($http, $interval, $timeout, $rootScope, $localStorage) {
	let ask = this;
	let maxTime = 7000;
	let maxQuestions = 5;
	ask.timer = 100;
	ask.score = 1;
	ask.questions = [];
	$rootScope.scoreIteration = 2;
	$localStorage.$default({
		players : []
	});
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
			ask.resultID = resultID(ask.score);
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

	// Modifie le score à mi-chemin du chrono
	ask.scoreTime = function() {
		$rootScope.scoreIteration = 1;
		return $rootScope.scoreIteration;
	}

	
	ask.write = function(pseudo, score) {
		let form = {
			"name" : pseudo,
			"rank" : score,
			"date" : Date.now() };
		$localStorage.players.push(form);
		window.location = '/#/scores';
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

// ID d'affichage des résultats
function resultID(score) {
	if(score > 4) {
		return 4;
	} else if(score >= 0) {
		return 3;
	} else if(score < -2) {
		return 2;
	} else if(score < 0) {
		return 1;
	}
}