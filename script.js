function loadModule(module) {
  var s = document.createElement("script");

  s.src = module + ".js";

  document.body.appendChild(s);

  s.onload = function () {
    eval(module).init();
  }
}

loadModule("localGame");

$(".newNetGame, .joinNetGame").click(function () {
  loadModule("networkGame");
});
