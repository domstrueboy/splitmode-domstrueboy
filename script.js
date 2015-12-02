(function(){

    var app = {

        init: function(){
          this.newGame();
          this.appBuild();
        },

        newGame: function(){
          this.resetBoard();
          this.step = 1;
          this.state = "zero";
          this.displayCurrentPlayer();
          this.scoreZero = 0;
          this.scoreCross = 0;
          this.scoreUpdate();
        },

        newNetGame: function () {

        	this.newGame();

          	this.gameState = this.request('POST', 'games/', {"type" : 0}, 201);

          	console.log("token = " + this.gameState.token);
          	alert("token = " + this.gameState.token);


        },

        joinNetGame: function () {

	        this.token = prompt("token = ", '');

	        this.gameState = this.request('GET', 'games/' + this.token, {}, 200);

	        this.stateFromNet();

	        this.fieldFromNet();

        },

        stateFromNet: function() {

        	if(this.gameState.state === "first-player-turn"){
        	    this.state = "zero";
        	} else if(this.gameState.state === "second-player-turn"){
        	    this.state = "cross";
        	} else {
        		console.log("Error in stateFromNet");
        		alert("Error in stateFromNet");
        	}
       	},

        fieldFromNet: function() {

        	this.gameState.field1Bin = this.gameState.field1.toString(2).split("");
	        this.gameState.field2Bin = this.gameState.field2.toString(2).split("");

	        var field = $(".cell");
	        for(var i = 0; i < 9; i++){

	        	field[i].removeClass("zero").removeClass("cross");

	        	if(this.gameState.field1Bin[i] === "1"){
	        		field[i].addClass("zero");
	        	} else if(this.gameState.field2Bin[i] === "1"){
	        		field[i].addClass("cross");
	        	}
	        }

        },

        updateGameState: function() {
        	this.gameState = this.request('GET', 'games/' + this.token, {}, 200);

        	stateFromNet();
        	fieldFromNet();

        },

        makeATurn: function() {

        	var player;

        	if(app.state === "zero"){
        		player = 1;
        	} else if(app.state === "cross"){
        		player = 2;
        	} else {
        		console.log("Error in makeATurn");
        		alert("Error in makeATurn");
        	}



	        var field = $(".cell");
	        for(var i = 0; i < 9; i++){

	        	if(field[i].hasClass("zero")){
	        		this.gameState.field1Bin.push('1');
	        	} else if(field[i].hasClass("cross")){
	        		this.gameState.field2Bin.push('1');
	        	} else {
	        		this.gameState.field1Bin.push('0');
	        		this.gameState.field2Bin.push('0');
	        	}
	        }

	        this.gameState.field1 = this.gameState.field1Bin.join("").parseInt();
	        this.gameState.field2 = this.gameState.field2Bin.join("").parseInt();



        	this.gameState = this.request('PUT', 'games/' + this.token, {
        		"player": player,
        		"position": 0
        	}, 200);
        },

        request: function (requestType, requestRoute, requestBody, requestCode) {

          var xhr = new XMLHttpRequest(); //Создаём новый объект XMLHttpRequest

          // Конфигурируем его: POST-запрос на URL 'http://aqueous-ocean-2864.herokuapp.com/games' :
          xhr.open(requestType, 'http://aqueous-ocean-2864.herokuapp.com/' + requestRoute, true);
          xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

          xhr.send( // Отсылаем запрос
            JSON.stringify(requestBody)
          );

          xhr.onreadystatechange = function() {
              if (xhr.readyState != 4) {
                return;
              }

              // Если код ответа сервера не 201, то это ошибка
              if (xhr.status == requestCode) {
                return JSON.parse(xhr.responseText); // responseText -- текст ответа.
              } else {
                  // обработать ошибку
                  alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
              }
          }
        },

        appBuild: function(){
          this.menuControl();
          this.clickControl();
        },

        nextGame: function(){
          this.resetBoard();
          this.step = 1;
          this.state = this.prevWinner;
          this.displayCurrentPlayer();
        },

        nextStep: function(){
          this.step++;
          this.stateUpdate();
          this.displayCurrentPlayer();
        },

    		stateUpdate: function(){
    			if(this.state === "cross"){
    				this.state = "zero";
    			} else if(this.state === "zero"){
    				this.state = "cross";
    			}
    		},

        displayCurrentPlayer: function(){
          if(app.state === "zero"){
            $(".score-cell-cross").removeClass("score-cross");
            $(".score-cell-zero").addClass("score-zero");
          } else if(app.state === "cross"){
            $(".score-cell-zero").removeClass("score-zero");
            $(".score-cell-cross").addClass("score-cross");
          }
        },

        playerWin: function(classDetected){

          if(classDetected === "zero"){
    				this.scoreZero += 2;
    			} else if(classDetected === "cross"){
    				this.scoreCross += 2;
    			}

          this.scoreUpdate();
        },

        friendshipWin: function(){
    		this.scoreZero++;
    		this.scoreCross++;
            this.scoreUpdate();
            this.nextGame();

        },

        scoreUpdate: function(){
          $(".score-playerZero").text("" + app.scoreZero);
          $(".score-playerCross").text("" + app.scoreCross);
        },

        menuControl: function(){
          $(".newGame").click(function(){
            app.newGame();
          });

          $(".newNetGame").click(function(){
            app.newNetGame();
          });

          $(".joinNetGame").click(function () {
            app.joinNetGame();
          });

          $(".updateGameState").click(function () {
            app.updateGameState();
          });
        },

        clickControl: function(){

			$(".cell").click(function(){

                if(!$(this).hasClass("zero") && !$(this).hasClass("cross")){

                  $(this).addClass(app.state);
                  app.nextStep();

                  if(app.step > 5){
                    app.detectWin();
                  }

                }

    		});
        },

        resetBoard: function(){
          $(".cell").removeClass("zero").removeClass("cross");
        },

        detectWin: function(){

          var zeros = [];
          var crosses = [];

          for(var i = 0; i < 9; i++){

          	if($('.cell:eq(' + i + ')').hasClass("zero")){

          		zeros.push('1');
          		crosses.push('0');

          	} else if($('.cell:eq(' + i + ')').hasClass("cross")){

          		crosses.push('1');
          		zeros.push('0');

          	} else {

          		zeros.push('0');
          		crosses.push('0');

          	}
          }

          zeros = zeros.join('');
          crosses = crosses.join('');

          zeros = parseInt(zeros, 2);
          crosses = parseInt(crosses, 2);

          var wins = [ 448, 56, 7, 292, 146, 73, 84, 273 ];

          if(wins.indexOf(zeros) != -1){

          	this.prevWinner = "zero";
            this.playerWin("zero");
            alert("ZERO WIN!");
            this.nextGame();

          } else if(wins.indexOf(crosses) != -1){

          	this.prevWinner = "cross";
            this.playerWin("cross");
            alert("CROSS WIN!");
            this.nextGame();

          } else if(app.step > 9){
                    
            alert("FRIENDSHIP WIN!");
            app.friendshipWin();
          }

        }

    }

    app.init();

}());
