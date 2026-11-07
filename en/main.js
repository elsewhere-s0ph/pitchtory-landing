/* Pitchtory landing — main script (EN). No dependencies, no build. */
(function(){
"use strict";

/* theme: persistent preference shared across IT and EN (key: pitchtory-theme) */
var root = document.documentElement;
var btn = document.getElementById("themeBtn");
var lbl = document.getElementById("themeLbl");
var moon = document.getElementById("icoMoon");
var sun = document.getElementById("icoSun");
function applyTheme(t){
  root.dataset.theme = t;
  lbl.textContent = t === "dark" ? "Dark" : "Light";
  moon.style.display = t === "dark" ? "" : "none";
  sun.style.display = t === "dark" ? "none" : "";
  try { localStorage.setItem("pitchtory-theme", t); } catch (e) {}
}
btn.addEventListener("click", function(){
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});
lbl.textContent = root.dataset.theme === "dark" ? "Dark" : "Light";
moon.style.display = root.dataset.theme === "dark" ? "" : "none";
sun.style.display = root.dataset.theme === "dark" ? "none" : "";

/* reveal on scroll, with fallback for browsers without IntersectionObserver */
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

/* QTE demo — same atmosphere as the game, maths kept secret:
   demo weights are encoded so the real numbers never appear in source */
var choices = document.getElementById("choices");
if (choices) {
  var P = atob("MC43MiAwLjc2IDAuNjg=").split(" ").map(Number);
  var OUT = {
    goal: [
      "GOAL! Into the corner — the keeper never moved.",
      "GOAL! Perfect Panenka, the arena erupts.",
      "GOAL! He decided himself — and he was right."
    ],
    save: [
      "Saved. The keeper signed it.",
      "Post! Three centimetres from legend.",
      "Saved. The wrong kind of courage at the wrong minute."
    ]
  };
  var FLAVOR_PICK = "Odds are never declared — the scoreboard confesses them.";
  var FLAVOR_TIMEOUT = "Time's up: the cautious call took it. Happens to the greats too.";
  var FLAVOR_START = "The arena holds its breath. Choose how to take it:";
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
    var idx = btn ? parseInt(btn.getAttribute("data-idx"), 10) : 2; /* automatic cautious pick on timeout */
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
