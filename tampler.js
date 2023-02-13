var send = {};
var mlog = [];
function oneClick(allData) {
  //One click
  First(allData);
  Last(allData);
}
function First(allData) {
  //First
  send = {};
  var war = Object.values(allData.f.w);
  var team = [];
  var enemy = [];
  war.forEach((play) => {
    if (allData.f.myteam == play.team) {
      team.push(play);
    } else {
      enemy.push(play);
    }
  });
  Object.assign(send, { team: team });
  Object.assign(send, { enemy: enemy });
  Object.assign(send, { Startat: new Date().toJSON() });
}
function Last(allData) {
  if (allData.hasOwnProperty("loot")) {
    Object.assign(send, { loot: Object.values(allData.item) });
  }
  Object.assign(send, { ev: allData.ev });
  Object.assign(send, { Endat: new Date().toJSON() });

  if (
    send.hasOwnProperty("loot") &&
    send.loot.length !== 0 &&
    send.enemy[0].id < 0
  ) {
    Object.assign(send, { kto: [] });
    if (send.team.length == 1) {
      var k = [];
      send.loot.forEach((item) => {
        k.push(Engine.hero.d.nick);
        k.push("ITEM#" + item.hid);
        k.push(item.name);
      });
      Object.assign(send, { kto: k });
    }
  }
  if (send.enemy[0].id < 0) {
    //Mob
    if (send.hasOwnProperty("loot")) {
      sendvsMob(send);
    }
    mlog = [];
  } else {
    Object.assign(send, { log: mlog });
    sendvsPlayer(send);
    mlog = [];
  }
}

function Dead(allData) {
  Last(allData);
}

var id1 = setInterval(() => {
  if (
    Engine !== undefined &&
    Engine.ev !== "" &&
    Engine.hero.d.nick !== undefined &&
    asdasd.map !== null &&
    Engine.battle !== undefined
  ) {
    clearInterval(id1);
    start();
  }
}, 200);

function start() {
  console.log("Loot Load");
  var tmp = Engine.battle.updateData;
  Engine.battle.updateData = (data, allData) => {
    var ret = tmp(data, allData);
    if (allData.f.m !== undefined) {
      allData.f.m.forEach((txt) => {
        mlog.push(txt);
      });
    }
    if (
      allData.hasOwnProperty("dead") &&
      allData.hasOwnProperty("matchmaking_state")
    ) {
      //Dead
      Dead(allData);
    } else if (
      allData.f.hasOwnProperty("init") &&
      allData.f.hasOwnProperty("endBattle") &&
      allData.f.hasOwnProperty("auto") &&
      allData.hasOwnProperty("dead") == false
    ) {
      //Oneclick kill
      oneClick(allData);
    } else if (allData.f.hasOwnProperty("init")) {
      //Pierwsze
      First(allData);
    } else if (
      allData.f.hasOwnProperty("endBattle") &&
      allData.f.hasOwnProperty("m")
    ) {
      //Last
      Last(allData);
    }

    if (allData.hasOwnProperty("loot") && send.team.length !== 1) {
      //Loot with team
      lootchat();
    }
    return ret;
  };
}

function lootchat() {
  var tmploot = Engine.chat.setPrivInGeneral;
  Engine.chat.setPrivInGeneral = (t, e) => {
    var retloot = tmploot(t, e);
    var msg = [];
    if (e.t.includes("ITEM#") == true) {
      if (e.t.includes("Podział łupów") == true) {
        var textmsg = e.t
          .replace("[b]Podział łupów[/b]:", "")
          .replace(" otrzymał", "")
          .replaceAll('"', "")
          .replaceAll("(", "")
          .replaceAll(")", "")
          .split(":");
        textmsg.forEach((txt) => {
          if (txt.includes("ITEM#") == true) {
            txt.split("ITEM#").forEach((ele) => {
              msg.push(ele);
            });
          } else {
            msg.push(txt);
          }
        });
        console.log(msg);
        updatevsMob(msg);
      }
    }
    return retloot;
  };
}

function sendvsMob(send) {
  var data = JSON.stringify(send);
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8080/addvsMob",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
    success: function (res) {
      console.log(res);
    },
  });
}

function sendvsPlayer(send) {
  var data = JSON.stringify(send);
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8080/addvsPlayer",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
    success: function (res) {
      console.log(res);
    },
  });
}

function updatevsMob(data) {
  var data = JSON.stringify({ ev: send.ev, kto: data });
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8080/updatevsMob",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
    success: function (res) {
      console.log(res);
    },
  });
}
