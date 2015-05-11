var quizTemplate = {
	quizContain: $('#quiz-container'),
	all:{
		header: '<h2 class="header"></h2>',
		answer: '<div class="answer-box"><h3></h3><p></p></div>',
		results:'<div class="results"><h2></h2><img src=""><span></span></div>'
	},
	colors:{
		correct: '#92ea92',
		incorrect: '#ea9292'
	},
	image:{
		frame: '<div class="question image"></div>',
		optionFrame: '<div class="image-option"><div><img src=""><span class="option-caption"></span></div><span class="option-text"></span></div>'
	},
	text:{
		frame: 	'<div class="question text"><div class="main-img"><img src=""><span></span></div></div>',
		optionFrame: '<div class="text-option"><span class="option-text"></span></div>'
	},
	data:{
		quizQuestions:[],
		quizStatus:[],
		quizAnswers:[],
		quizChoices:[],
		questAnswered:0,
		totalQuest:0,
		resultsText:[],
		resultsImg:[]
	},
	calcAnswers:function(data){
		for (i=1 ; i < data.length; i++){
			quizTemplate.data.quizAnswers[i-1] = parseInt(data[i][8]);
			quizTemplate.data.quizChoices[i-1] = false;
			quizTemplate.data.totalQuest += 1;
		}
	},
	processData:function(){
		$.get('data/test-quest.csv', function(data){
			var rows = data.split("\n"); // an array where each item is a row
			rows.forEach(function getvalues(ourrow){
				var columns = ourrow.split(',');
				quizTemplate.data.quizQuestions.push(columns)
			});
			quizTemplate.calcAnswers(quizTemplate.data.quizQuestions);
			quizTemplate.createQuiz(quizTemplate.data.quizQuestions);
		});
	},
	calcResults:function(choices, answers){
		var correct = 0;

		/* COUNT HOW MANY ARE CORRECT */
		for (i=0 ; i < quizTemplate.data.totalQuest ; i++){
			if (choices[i] == answers[i]){
				correct += 1;
			}
		}

		/* AUTO SCROLL TO RESULTS */
		$('html, body').animate({
		    scrollTop: 10000
		}, 1000);

		/* POPULATE RESULTS */
		quizTemplate.quizContain.append(quizTemplate.all.results);
		$('.results h2').html('You got ' + correct + ' out of ' + quizTemplate.data.totalQuest + ' correct.');
		$('.results img').attr('src','/assets/' + quizTemplate.data.resultsImg[correct]);
		$('.results span').html(quizTemplate.data.resultsText[correct]);
	},
	crunchImage:function(quest, option, text){
		if (quizTemplate.data.quizStatus[quest] == false){
			/* gray out all boxes not the one clicked */
			$('.question:eq('+ quest +') .image-option:not(.image-option:eq('+option+')) img').add('.question:eq('+ quest +') .image-option:not(.image-option:eq('+option+')) span').css('opacity', 0.4); 

			/* Which option did the player pick? */
			quizTemplate.data.quizChoices[quest] = option;

			/* All Options Color Coded Incorrect */
			$('.question:eq('+ quest +') .image-option').css('background',quizTemplate.colors.incorrect);

			/* Color Code Correct Answer and Bring to 1.0 Opacity */
			$('.question:eq('+ quest +') .image-option:eq('+parseInt(quizTemplate.data.quizQuestions[quest+1][8])+')').css('background',quizTemplate.colors.correct);
			$('.question:eq('+ quest +') .image-option:eq('+parseInt(quizTemplate.data.quizQuestions[quest+1][8])+') img').add('.question:eq('+ quest +') .image-option:eq('+parseInt(quizTemplate.data.quizQuestions[quest+1][8])+') span').css('opacity','1');

			/* META */
			quizTemplate.data.questAnswered += 1;
			quizTemplate.data.quizStatus[quest] = true;
		}
		else {
			return;
		}

		/* TEST IF QUIZ IS FINISHED */
		if (quizTemplate.data.questAnswered == quizTemplate.data.totalQuest){
			quizTemplate.calcResults(quizTemplate.data.quizChoices, quizTemplate.data.quizAnswers);
		}
	},
	crunchText:function(quest, option, text){
		if (quizTemplate.data.quizStatus[quest] == false){
			/* gray out all boxes not the one clicked */
			$('.question:eq('+ quest +') .text-option:not(.text-option:eq('+option+')) img').add('.question:eq('+ quest +') .text-option:not(.text-option:eq('+option+')) span').css('opacity', 0.4); 

			/* Which option did the player pick? */
			quizTemplate.data.quizChoices[quest] = option;

			/* All Options Color Coded Incorrect */
			$('.question:eq('+ quest +') .text-option').css('background',quizTemplate.colors.incorrect);

			/* Color Code Correct Answer and Bring to 1.0 Opacity */
			$('.question:eq('+ quest +') .text-option:eq('+parseInt(quizTemplate.data.quizQuestions[quest+1][8])+')').css('background',quizTemplate.colors.correct);
			$('.question:eq('+ quest +') .text-option:eq('+parseInt(quizTemplate.data.quizQuestions[quest+1][8])+') span').css('opacity','1');

			/* META */
			quizTemplate.data.questAnswered += 1;
			quizTemplate.data.quizStatus[quest] = true;
		}
		/* Add Choice to Array of Choices */
		else {
			return;
		}

		/* TEST IF QUIZ IS FINISHED */
		if (quizTemplate.data.questAnswered == quizTemplate.data.totalQuest){
			quizTemplate.calcResults(quizTemplate.data.quizChoices, quizTemplate.data.quizAnswers);
		}
	},
	createQuiz:function(data){
		var ii = 0;

		/* GO THROUGH EACH QUESTION; TYPE
		=================================*/
		for (i=1 ; i < data.length ; i++){
			quizTemplate.data.quizStatus[ii] = false;								//toggle all questions not answered
			if (data[i][1] === 'Image' || data[i][1] === 'image'){
				/* PARSE IMAGES AND CAPTIONS AND CHOICES */
				var parOptions = data[i][5].split(';'); 							//parse options
				var parImages = data[i][6].split(';'); 								//parse images
				var parCaptions = data[i][7].split(';');							//parse captions

				/* CONFIGURE QUESTION */
				quizTemplate.quizContain.append(quizTemplate.image.frame); 			//add question
				var curQuest = $('#quiz-container .question:eq('+ii+')'); 			//current question
				var curQuestTag = '.question:eq('+ii+')';

				/* ADD ELEMENTS */
				curQuest.append($(quizTemplate.all.header).html(i + '. ' + data[i][0])); 	//add question
				for (iii=0 ; iii < parOptions.length ; iii++){							//add options
					curQuest.append(quizTemplate.image.optionFrame);					//add option frame
					var curOption = $(curQuestTag + ' .image-option:eq('+iii+')');		//init object
					var curOptionTag = curQuestTag + ' .image-option:eq('+iii+')';			//init text

					curOption.on('click', function(){
						var quest = parseInt($(this).attr('question'));
						var option = parseInt($(this).attr('option'));
						var text = $(this).attr('text');
						quizTemplate.crunchImage(quest, option, text);
					});	

					curOption.attr({													//add option and question numbers
						'option': 		iii,
						'question': 	ii,
						'text': 		parOptions[iii]
					});										
					$(curOptionTag + ' img').attr('src', '/assets/' + parImages[iii]);			//add images
					$(curOptionTag + ' .option-text').html(parOptions[iii]);					//add option text
					$(curOptionTag + ' .option-caption').html(parCaptions[iii]);				//add captions
				}

				/* INSERT ANSWER BOX */
				quizTemplate.quizContain.append($(quizTemplate.all.answer).attr('question', i).css('display','none'));

				ii += 1;
			}
			else if (data[i][1] === 'Text' || data[i][1] === 'text'){
				/* PARSE IMAGES AND CAPTIONS AND CHOICES */
				var parImages = data[i][3].split(';'); 	
				var parOptions = data[i][5].split(';'); 							

				/* CONFIGURE QUESTION */
				quizTemplate.quizContain.append(quizTemplate.text.frame); 
				var curQuest = $('#quiz-container .question:eq('+ii+')'); 		
				var curQuestTag = '.question:eq('+ii+')';				

				/* ADD ELEMENTS */
				curQuest.append($(quizTemplate.all.header).html(i + '. ' + data[i][0])); 	
				for (iii=0 ; iii < parOptions.length ; iii++){							
					curQuest.append(quizTemplate.text.optionFrame);					
					var curOption = $(curQuestTag + ' .text-option:eq('+iii+')');		
					var curOptionTag = curQuestTag + ' .text-option:eq('+iii+')';			

					curOption.on('click', function(){
						var quest = parseInt($(this).attr('question'));
						var option = parseInt($(this).attr('option'));
						var text = $(this).attr('text');
						quizTemplate.crunchText(quest, option, text);
					});	

					curOption.attr({													
						'option': 		iii,
						'question': 	ii,
						'text': 		parOptions[iii]
					});										
					$(curOptionTag + ' span').html(parOptions[iii]);					//add option text
				}

				// * MAIN IMGS */
				$(curQuestTag + ' img').attr('src', '/assets/' + parImages[1]);
				$(curQuestTag + ' .main-img span').html(data[i][4]);

				quizTemplate.quizContain.append($(quizTemplate.all.answer).attr('question', i).css('display','none'));

				ii += 1;
			}
		}
	}
}


/* GRAB QUESTION CSV AND PARSE */
$.get('data/test-results.csv',function(data){
	var rows = data.split("\n"); // an array where each item is a row
	var temp = [];
	rows.forEach(function getvalues(ourrow){
		var columns = ourrow.split(',');
		temp.push(columns)
	});

	for (i=1; i < temp.length ; i++){
		quizTemplate.data.resultsText[i-1] = temp[i][1];
		quizTemplate.data.resultsImg[i-1] = temp[i][2];
	}

	quizTemplate.processData();
});