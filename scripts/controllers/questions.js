// Contrôleur de la page des questions
app.controller('QuestionsCtrl', function($http, $interval) {
	let ask = this;
	let score = 0;
	ask.questions = [];

	// Récupération des questions et réponses
	$http.get('/question.json').then(function(data) {
		ask.questions = data.data;

		$interval(function() {
			let rand = Math.ceil(Math.random()*4);
			console.log('Interval triggered');
			
			ask.demand = ask.questions[rand].question;
			touillette(ask.questions[rand].reponses);
			ask.answers = ask.questions[rand].reponses;
		}, 3000, 5);
		
	});

	// Filtre random pour ng-repeat
	ask.random = function() {
		return 0.5 - Math.random();
	}
	
});

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