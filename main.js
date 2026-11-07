/* Pitchtory landing — script principale (IT). niente dipendenze, niente build. */
(function(){
"use strict";

/* tema: preferenza persistente condivisa tra IT e EN (chiave pitchtory-theme) */
var root = document.documentElement;
var btn = document.getElementById("themeBtn");
var lbl = document.getElementById("themeLbl");
var moon = document.getElementById("icoMoon");
var sun = document.getElementById("icoSun");
function applyTheme(t){
  root.dataset.theme = t;
  lbl.textContent = t === "dark" ? "Scuro" : "Chiaro";
  moon.style.display = t === "dark" ? "" : "none";
  sun.style.display = t === "dark" ? "none" : "";
  try { localStorage.setItem("pitchtory-theme", t); } catch (e) {}
}
btn.addEventListener("click", function(){
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});
lbl.textContent = root.dataset.theme === "dark" ? "Scuro" : "Chiaro";
moon.style.display = root.dataset.theme === "dark" ? "" : "none";
sun.style.display = root.dataset.theme === "dark" ? "none" : "";

/* reveal on scroll, con fallback per browser senza IntersectionObserver */
var els = document.querySelectorAll(".fade");
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(function(el){ io.observe(el); });
} else {
  els.forEach(function(el){ el.classList.add("in"); });
}

/* demo QTE — atmosfera identica al gioco, calcoli riservati:
   i pesi della demo sono codificati per non stampare i numeri veri nel sorgente */
var choices = document.getElementById("choices");
if (choices) {
  var P = atob("MC43MiAwLjc2IDAuNjg=").split(" ").map(Number);
  var OUT = {
    goal: [
      "GOL! All'incrocio, il portiere resta a guardare.",
      "GOL! Cucchiaio perfetto, l'arena esplode.",
      "GOL! L'ha deciso lui — e aveva ragione."
    ],
    save: [
      "Parata. Il portiere ci ha messo la firma.",
      "Palo! A tre centimetri dalla leggenda.",
      "Parata. Coraggio sbagliato al minuto sbagliato."
    ]
  };
  var FLAVOR_PICK = "Le probabilità non si dichiarano: le confessa il tabellone.";
  var FLAVOR_TIMEOUT = "Tempo scaduto: è partita la scelta prudente. Succede anche ai grandi.";
  var FLAVOR_START = "L'arena trattiene il respiro. Scegli come batterlo:";
  var DUR = 10;
  var fill = document.getElementById("fill");
  var bar = document.getElementById("timebar");
  var verdict = document.getElementById("verdict");
  var flavor = document.getElementById("flavor");
  var again = document.getElementById("again");
  var clock = document.getElementById("clock");
  var timer = null, started = 0, resolved = false;

  function arm(){
    resolved = false; started = performance.now();
    verdict.textContent = ""; verdict.className = "verdict";
    flavor.textContent = FLAVOR_START;
    again.style.display = "none";
    choices.classList.remove("locked");
    var all = choices.querySelectorAll(".choice");
    for (var i = 0; i < all.length; i++) { all[i].classList.remove("picked"); }
    bar.classList.remove("urgent");
    clock.textContent = "89'";
    fill.style.transition = "none"; fill.style.width = "100%";
    requestAnimationFrame(function(){
      fill.style.transition = "width " + DUR + "s linear";
      fill.style.width = "0%";
    });
    timer = setTimeout(function(){ resolve(null); }, DUR * 1000);
    tick();
  }
  function tick(){
    if (resolved) { return; }
    var left = DUR - (performance.now() - started) / 1000;
    if (left <= 3) { bar.classList.add("urgent"); }
    if (left > 0) { requestAnimationFrame(tick); }
  }
  function resolve(btn){
    if (resolved) { return; }
    resolved = true; clearTimeout(timer);
    var idx = btn ? parseInt(btn.getAttribute("data-idx"), 10) : 2; /* prudente automatico allo scadere */
    var goal = Math.random() < P[idx];
    choices.classList.add("locked");
    var picked = choices.querySelector('[data-idx="' + idx + '"]');
    if (picked) { picked.classList.add("picked"); }
    if (goal) {
      verdict.textContent = OUT.goal[idx];
      verdict.classList.add("goal");
    } else {
      verdict.textContent = OUT.save[idx];
    }
    flavor.textContent = btn ? FLAVOR_PICK : FLAVOR_TIMEOUT;
    clock.textContent = "90'";
    again.style.display = "inline-block";
  }
  var btns = choices.querySelectorAll(".choice");
  for (var j = 0; j < btns.length; j++) {
    btns[j].addEventListener("click", function(){ resolve(this); });
  }
  again.addEventListener("click", arm);
  arm();
}
})();
