function loadModule(module) {
  var s = document.createElement("script");

  s.src = module + ".js";

  document.body.appendChild(s);

  s.onload = function () {
    eval(module).init();
  }
}

//loadModule("localGame");
loadModule("networkGame");
/*
$(".newNetGame", ".joinNetGame").click(function () {
  loadModule("networkGame");
});*/
