(function(){

    var app = {

        init: function(){
          this.newGame();
          this.appBuild();
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

        newGame: function(){
          this.resetBoard();
          this.step = 1;
          this.state = "zero";
          this.displayCurrentPlayer();
          this.scoreZero = 0;
          this.scoreCross = 0;
          this.scoreUpdate();

        },

        nextStep: function(){
          return ++this.step;
        },

    		stateUpdate: function(){
    			if(this.state === "cross"){
    				return "zero";
    			} else if(this.state === "zero"){
    				return "cross";
    			}
    		},

        playerWin: function(classDetected){

          if(classDetected === "zero"){
    				app.scoreZero += 2;
    			} else if(classDetected === "cross"){
    				app.scoreCross += 2;
    			}

          app.scoreUpdate();
        },

        friendshipWin: function(){
    				app.scoreZero++;
    				app.scoreCross++;

            app.scoreUpdate();
        },

        scoreUpdate: function(){
          $(".score-playerZero").text("" + app.scoreZero);
          $(".score-playerCross").text("" + app.scoreCross);
        },

        menuControl: function(){
          $(".newGame").click(function(){
            app.newGame();
          });
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

        clickControl: function(){

			       $(".cell").click(function(){

                if(!$(this).hasClass("zero") && !$(this).hasClass("cross")){

                  $(this).addClass(app.state);
                  app.step = app.nextStep();
                  app.state = app.stateUpdate();
                  app.displayCurrentPlayer();

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
    					})
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
             app.prevWinner = classDetected;
             app.playerWin(classDetected);
             alert(classDetected.charAt(0).toUpperCase() + classDetected.substr(1) + " WIN!");
             app.nextGame();
          }

        }
    }

    app.init();

}());
