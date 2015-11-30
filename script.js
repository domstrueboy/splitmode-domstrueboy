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

	        var token = prompt("token = ", '');

	        this.gameState = this.request('GET', 'games/' + token, {}, 200);

	        if(this.gameState.state === "first-player-turn"){
	        	this.state = "zero";
	        } else if(this.gameState.state === "second-player-turn"){
	        	this.state = "cross";
	        }

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
        },

        clickControl: function(){

			       $(".cell").click(function(){

                if(!$(this).hasClass("zero") && !$(this).hasClass("cross")){

                  $(this).addClass(app.state);
                  app.nextStep();

                  if(app.step > 5){
                    app.detectWin("zero");
                    app.detectWin("cross");
                  }

                  if(app.step > 9){
                    alert("Friendship win!");
                    app.friendshipWin();
                    app.nextGame();
                  }
                }
    					});
            },

        resetBoard: function(){
          $(".cell").removeClass("zero").removeClass("cross");
        },

        detectWin: function(classDetected){ //stupid detection

          if(
             ($(".row1:eq(0)").hasClass(classDetected) &&
             $(".row1:eq(1)").hasClass(classDetected) &&
             $(".row1:eq(2)").hasClass(classDetected)) ||

             ($(".row2:eq(0)").hasClass(classDetected) &&
             $(".row2:eq(1)").hasClass(classDetected) &&
             $(".row2:eq(2)").hasClass(classDetected)) ||

             ($(".row3:eq(0)").hasClass(classDetected) &&
             $(".row3:eq(1)").hasClass(classDetected) &&
             $(".row3:eq(2)").hasClass(classDetected)) ||

             ($(".column1:eq(0)").hasClass(classDetected) &&
             $(".column1:eq(1)").hasClass(classDetected) &&
             $(".column1:eq(2)").hasClass(classDetected)) ||

             ($(".column2:eq(0)").hasClass(classDetected) &&
             $(".column2:eq(1)").hasClass(classDetected) &&
             $(".column2:eq(2)").hasClass(classDetected)) ||

             ($(".column3:eq(0)").hasClass(classDetected) &&
             $(".column3:eq(1)").hasClass(classDetected) &&
             $(".column3:eq(2)").hasClass(classDetected)) ||

             ($(".row1:eq(0)").hasClass(classDetected) &&
             $(".row2:eq(1)").hasClass(classDetected) &&
             $(".row3:eq(2)").hasClass(classDetected)) ||

             ($(".row1:eq(2)").hasClass(classDetected) &&
             $(".row2:eq(1)").hasClass(classDetected) &&
             $(".row3:eq(0)").hasClass(classDetected))
           ){
             this.prevWinner = classDetected;
             this.playerWin(classDetected);
             alert(classDetected.charAt(0).toUpperCase() + classDetected.substr(1) + " WIN!");
             this.nextGame();
          }

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
        }

    }

    app.init();

}());
