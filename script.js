function loadModule(module) {
  var s = document.createElement("script");

  s.src = module;

  document.body.appendChild(s);

  s.onload = function () {
    app.init();
  }
}

loadModule("localGame.js");

$(".newNetGame", ".joinNetGame").click(function () {
  loadModule("networkGame.js");
});

$(".newGame").click(function () {
  loadModule("localGame.js");
});
