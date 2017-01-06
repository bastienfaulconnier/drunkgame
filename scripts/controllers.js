// Contrôleur de la page des scores
app.controller('ScoresCtrl', function($localStorage) {
	let scores = this;
	scores.players = $localStorage.players;
});

// Contrôleur de la page des questions
app.controller('QuestionsCtrl', function($interval, $timeout, $rootScope, $localStorage, questions) {
	let ask = this;

	let maxTime = 7000;
	let maxQuestions = 5;
	ask.timer = 100; // Taille de la barre chrono
	ask.changetimer = false; // Définit la couleur de la barre
	ask.score = 1; // Score de base
	$rootScope.scoreIteration = 2; // Gain de point
	ask.questions = questions.data;

	ask.view = false; // Définit la section affichée dans la view

	$localStorage.$default({
		players : []
	});
	
		
	// Affichage de la première question
	let rand = Math.ceil(Math.random()*9);
	maxQuestions--;
	touillette(ask.questions[rand].reponses);
	ask.demand = ask.questions[rand].question;
	ask.answers = ask.questions[rand].reponses;
	ask.questions.splice(rand, 1);


	// Timer
	let interval = $interval(function() {
		ask.timer -= 100 / (maxTime / (1000/60));

		// Changement du gain de point et couleur de barre à 50%
		if(ask.timer <= 50) {
			ask.changetimer = true;
			$rootScope.scoreIteration = 1;
		}
		// Auto-submit en fin de chrono
		if(ask.timer <= 0) {
			ask.check('miss');
		}
	}, 1000/60);


	// Fonction submit
	ask.check = function(bool) {
		// Reset de la barre chrono
		ask.timer = 100; 
		ask.changetimer = false; 

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

		$rootScope.scoreIteration = 2; // Reset du gain de score

		// Nouvelle question
		rand = Math.ceil(Math.random()*ask.questions.length-1);
		maxQuestions--;
		touillette(ask.questions[rand].reponses);
		ask.demand = ask.questions[rand].question;
		ask.answers = ask.questions[rand].reponses;
		ask.questions.splice(rand, 1);
	}

	// Ecriture dans le local history
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