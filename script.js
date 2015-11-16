(function(){

    var app = {

        init: function(){
            app.resetBoard();
            app.step = 1;
            app.state = app.stateUpdate(app.step);
            app.clickControl();
        },

        stepUpdate: function(step){
          return ++step;
        },

		stateUpdate: function(step){
			if(step % 2 !== 0){
				return "zero";
			} else{
				return "cross";
			}
		},

        clickControl: function(){

			$(".cell").click(function(){

            if(!$(this).hasClass("zero") && !$(this).hasClass("cross")){

              $(this).addClass(app.state);
              app.step = app.stepUpdate(app.step);
              app.state = app.stateUpdate(app.step);

              if(app.step > 5){
                app.detectWin("zero");
                app.detectWin("cross");
              }

              if(app.step > 9){
                alert("Frienship win!");
                app.init();
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
            alert(classDetected.charAt(0).toUpperCase() + classDetected.substr(1) + " WIN!");
            app.init();
          }

        }
    }

    app.init();

}());
