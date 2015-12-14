    var app = {

        init: function(){
          this.appBuild();
          this.scoreZero = 0;
          this.scoreCross = 0;
          this.prevWinner = "first-player";
        },

        newNetGame: function () {

          app.thisPlayer = "first-player-turn";

          this.request('POST', 'games/', {"type" : 0}, 201).then(
          	function(response) {

          		app.game = response;

          		console.log("token = " + app.game.token);
          		alert("token = " + app.game.token);

          		app.stateFromNet();
          		app.fieldFromNet();
              app.updateGame();
          	}
          );
        },

        joinNetGame: function () {

          clearInterval(app.intervalId);
          app.thisPlayer = "second-player-turn";

	        var token = prompt("token = ", '');

	        this.request('GET', 'games/' + token, {}, 200).then(
	        	function (response) {
	        		app.game = response;
	        		app.stateFromNet();
	        		app.fieldFromNet();
              app.updateGame();
	        	}
	        );
        },

        stateFromNet: function() {

        	if(this.game.state === "first-player-turn"){
        	    this.state = "zero";
        	} else if(this.game.state === "second-player-turn"){
        	    this.state = "cross";
        	} else {
        		console.log("Error in stateFromNet");
        	}
       	},

        fieldFromNet: function() {

        	this.game.field1Bin = this.game.field1.toString(2).split("").reverse();
	        this.game.field2Bin = this.game.field2.toString(2).split("").reverse();

	        var field = $(".cell");
          $(field).removeClass("zero").removeClass("cross");

	        for(var i = 0; i <= this.game.field1Bin.length; i++){

	        	if(this.game.field1Bin[i] === "1"){
	        		$(field[i]).addClass("zero");
	        	}
	        }

          for(var i = 0; i <= this.game.field2Bin.length; i++){

            if(this.game.field2Bin[i] === "1"){
               $(field[i]).addClass("cross");
           }
	        }
        },

        updateGame: function() {

          function func() {
            app.request('GET', 'games/' + app.game.token, {}, 200).then(
          		function (response) {
          			app.game = response;
          			app.stateFromNet();
          			app.fieldFromNet();
                app.displayCurrentPlayer();
                app.detectWin();
                if(app.thisPlayer === app.game.state){
                  $(".cell").removeClass("disabled");
                }
          		}
          	);
          }

          app.intervalID = setInterval(func, 2000);
        },

        makeATurn: function(clickedCell) {

        	var player, position;

        	if(app.state === "zero"){
        		player = 1;
        	} else if(app.state === "cross"){
        		player = 2;
        	} else {
        		console.log("Error in makeATurn");
        	}

            for(var i = 0; i < 9; i++){
              if(
                $(clickedCell).hasClass("cell-" + i)
                ){
                  position = i;
                  break;
              }
            }

        	this.request('PUT', 'games/' + this.game.token, {
        		"player": player,
        		"position": position
        	}, 200).then(

        		function (response) {

        			app.game = response;
	        		app.stateFromNet();
	        		app.fieldFromNet();
              app.displayCurrentPlayer();
              app.detectWin();
        		}
        	);
        },

        request: function (requestType, requestRoute, requestBody, responseCode) {

        	return new RSVP.Promise(function(resolve, reject){

				  var xhr = new XMLHttpRequest();

		          // Конфигурируем его: запрос на URL 'http://aqueous-ocean-2864.herokuapp.com/games' :
		          xhr.open(requestType, 'http://aqueous-ocean-2864.herokuapp.com/' + requestRoute/*, true*/);
		          xhr.onreadystatechange = handler;
		          xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

		          xhr.send( // Отсылаем запрос
		            JSON.stringify(requestBody)
		          );

		          function handler() {
		              if (xhr.readyState === xhr.DONE) {
			              // Если код ответа сервера не responseCode, то это ошибка
			              if (xhr.status == responseCode) {
			                resolve(JSON.parse(xhr.responseText));
			              } else {
			                // обработать ошибку
			                reject(this); // пример вывода: 404: Not Found
			              }
		          	  }
		      	  }
        	});
        },

        appBuild: function(){
          this.menuControl();
          this.clickControl();
        },

        detectWin: function () {
          if(app.game.state === "first-player-wins"){
            clearInterval(app.intervalId);
            alert(app.game.state + "!");
            this.scoreZero += 2;
            this.scoreUpdate();
            this.prevWinner = "first-player";
            if(app.thisPlayer[0] === app.game.state[0]){
              app.newNetGame();
            } else {
              app.joinNetGame();
            }
          } else if(app.game.state === "second-player-wins"){
            clearInterval(app.intervalId);
            alert(app.game.state + "!");
            this.scoreCross += 2;
            this.scoreUpdate();
            this.prevWinner = "second-player";
            if(app.thisPlayer[0] === app.game.state[0]){
              app.newNetGame();
            } else {
              app.joinNetGame();
            }
          } else if(app.game.state === "tie"){
            clearInterval(app.intervalId);
            alert(app.game.state + "!");
            this.scoreZero++;
        		this.scoreCross++;
            this.scoreUpdate();

              if(app.thisPlayer[0] === app.prevWinner[0]){
                app.newNetGame();
              } else {
                app.joinNetGame();
              }
          }
        },

        scoreUpdate: function(){
          $(".score-playerZero").text("" + app.scoreZero);
          $(".score-playerCross").text("" + app.scoreCross);
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

        menuControl: function(){

          $(".newNetGame").click(function(){
            app.newNetGame();
          });

          $(".joinNetGame").click(function () {
            app.joinNetGame();
          });

          $(".updateGame").click(function () {
            app.updateGame();
          });
        },

        clickControl: function(){

          $(".cell").click(function(){
            if(app.thisPlayer === app.game.state){
              if(!$(this).hasClass("zero") && !$(this).hasClass("cross")){
                $(this).addClass(app.state);
                app.makeATurn(this);
                $(".cell").addClass("disabled")
              }
            }
    	     });
        }
    }
