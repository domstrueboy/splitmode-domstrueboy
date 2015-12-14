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

          /*$(".newNetGame").click(function(){
            app.newNetGame();
          });*/

          /*$(".joinNetGame").click(function () {
            app.joinNetGame();
          });*/
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
