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
             this.prevWinner = classDetected;
             this.playerWin(classDetected);
             alert(classDetected.charAt(0).toUpperCase() + classDetected.substr(1) + " WIN!");
             this.nextGame();
          }

        }
    }

    app.init();

}());
