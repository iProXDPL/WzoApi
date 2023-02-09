// ==UserScript==
// @name         LootInfo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tempest.margonem.pl/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=margonem.pl
// @require      file:///C:/Users/desig/Documents/LootWzO/tampler.js
// @grant        GM.xmlHttpRequest
// ==/UserScript==


function zapiszloot() {
  var itemy = [];
  var team = [];
  var enemy = [];
  if (Engine.battle.myteam == 1) {
    team = Engine.battle.getFlist1();
    enemy = Engine.battle.getFlist2();
  } else {
    enemy = Engine.battle.getFlist1();
    team = Engine.battle.getFlist2();
  }
  var loot = Engine.items.fetchLocationItems("l");
  loot.forEach((element) => {
    itemy.push({
      id: element.id,
      hid: element.hid,
      tpl: element.tpl,
      name: element.name,
      icon: element.icon,
      cl: element.cl,
      pr: element.pr,
      prc: element.prc,
      stat: element.stat,
    });
  });
  var data = JSON.stringify({
    itemy: itemy,
    team: team,
    enemy: enemy,
    ev: Engine.ev,
    date: new Date().toJSON(),
  });
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8080/walki",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
  });
}

var id1 = setInterval(() => {
  if (
    Engine !== undefined &&
    Engine.ev !== "" &&
    Engine.hero.d.nick !== undefined &&
    asdasd.map !== null
  ) {
    clearInterval(id1);
    start();
  }
}, 200);

function start() {
  console.log("Loot Load");
  API.addCallbackToEvent("close_battle", zapiszloot);
}
