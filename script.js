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
            app.newGameRequest();
            app.networkGame();
          });

          $(".joinGame").click(function () {
            app.joinGameRequest();
            app.networkGame();
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

        networkGame: function () {

        },

        /*listGameRequest: function () {
          // 1. Создаём новый объект XMLHttpRequest
          var xhrNewGame = new XMLHttpRequest();

          // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
          xhrNewGame.open('GET', 'http://aqueous-ocean-2864.herokuapp.com/games', true);

          // 3. Отсылаем запрос
          xhrNewGame.send();

          xhrNewGame.onreadystatechange = function() {
              if (xhrNewGame.readyState != 4) {
                return;
              }

              console.log('Готово!');

              // 4. Если код ответа сервера не 200, то это ошибка
              if (xhrNewGame.status != 200) {
                  // обработать ошибку
                  alert( xhrNewGame.status + ': ' + xhrNewGame.statusText ); // пример вывода: 404: Not Found
              } else {
                  // вывести результат
                  var response = JSON.parse(xhrNewGame.responseText);
                  var tokens = [];
                  for(var i = 0; i < response.length; i++){
                    tokens.push(response[i].token);
                  }
                  alert(tokens); // responseText -- текст ответа.
              }
          }
        },*/

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

        newGameRequest: function () {

          this.request('POST', 'games/', {"type" : 0}, 201);

        },

        joinGameRequest: function () {

          var token = prompt("token = ");

          this.request('GET', 'games/' + token, {}, 200);

        }

    }

    app.init();

}());
