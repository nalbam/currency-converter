
var currency_min = 2;
var currency_max = 12;
var currency_count = 0;
var selected_index = 0;

var background = getBackgroundPage();

function init() {
  var count = localStorage.getItem("count");
  if (count < currency_min) {
    count = currency_min;
  }

  for (var i = 0; i < count; i++) {
    insertRow(true);
  }

  var idx = 0;
  var val = 1;

  var last_idx = localStorage.getItem("last_idx");
  var last_val = localStorage.getItem("last_val");

  if (last_idx != null && last_val != null) {
    idx = last_idx;
    val = last_val;
  }
  if (idx >= currency_count) {
    idx = 0;
    val = 1;
  }

  var e = document.getElementById("v" + idx);
  e.value = comma(val);
  e.focus();
  e.select();

  convertAll();
}

function insertRow(init) {
  var ch = document.createElement("img");
  ch.id = "ch" + currency_count;
  ch.name = currency_count;
  ch.src = "img/clear.gif";
  ch.width = 16;
  ch.height = 16;
  ch.addEventListener("click", onFocus, false);

  var v = document.createElement("input");
  v.type = "text";
  v.id = "v" + currency_count;
  v.name = currency_count;
  v.value = "converting..";
  v.setAttribute("maxlength", 12);
  v.addEventListener("keyup", onValueChange, false);
  v.addEventListener("change", onValueChange, false);
  v.addEventListener("paste", onPaste, false);
  v.addEventListener("focus", onFocus, false);
  v.onkeypress = function () { return onKeyPress(event); };

  var fg = document.createElement("img");
  fg.id = "fg" + currency_count;
  fg.name = currency_count;
  fg.src = "flag/us.png";
  fg.width = 16;
  fg.height = 11;

  var c = document.createElement("select");
  c.id = "c" + currency_count;
  c.name = currency_count;
  c.addEventListener("keypress", onCurrencyChange, false);
  c.addEventListener("change", onCurrencyChange, false);

  for (var currency in currencies) {
    var o = document.createElement("option");
    o.value = currency;
    o.text = currencies[currency].name;
    c.appendChild(o);
  }

  // td
  var td_ch = document.createElement("td");
  td_ch.appendChild(ch);

  var td_v = document.createElement("td");
  td_v.appendChild(v);

  var td_fg = document.createElement("td");
  td_fg.appendChild(fg);

  var td_c = document.createElement("td");
  td_c.appendChild(c);

  // tr
  var tr = document.createElement("tr");
  tr.id = "tr" + currency_count;
  tr.appendChild(td_ch);
  tr.appendChild(td_v);
  tr.appendChild(td_fg);
  tr.appendChild(td_c);

  // Table
  var tb = document.getElementById("tb");
  tb.appendChild(tr);

  var c = localStorage.getItem("c" + currency_count);
  if (c == undefined) {
    var e = document.getElementById("c" + currency_count);
    c = e.options[currency_count].value;
  }
  localStorage.setItem("c" + currency_count, c);
  selectIndex(currency_count, c);

  currency_count++;
  localStorage.setItem("count", currency_count);

  if (!init) {
    convertAll();
  }

  if (currency_count == currency_max) {
    showButton("insertRow", false);
  }
  showButton("deleteRow", true);
}

function deleteRow() {
  if (currency_count <= currency_min) {
    return;
  }

  currency_count--;
  localStorage.setItem("count", currency_count);
  localStorage.removeItem("c" + currency_count);

  var tb = document.getElementById("tb");
  tb.removeChild(document.getElementById("tr" + currency_count));

  if (currency_count < currency_max) {
    showButton("insertRow", true);
  }
  if (currency_count <= currency_min) {
    showButton("deleteRow", false);
  }
  if (currency_count <= selected_index) {
    selected_index = currency_count - 1;
    updateFocus();
  }
}

function selectIndex(id, c) {
  var e = document.getElementById("c" + id);
  for (var i = 0; i < e.options.length; i++) {
    if (e.options[i].value == c) {
      e.options[i].selected = true;
      updateFlag(id, c);
      break;
    }
  }
}

function onKeyPress(event) {
  return ((event.keyCode > 47 && event.keyCode < 58) || event.keyCode == 44 || event.keyCode == 46);
}

function onPaste(event) {
  var v = event.clipboardData.getData("Text");
  v = v.replace(/[^0-9.,]/g, "");
  event.returnValue = false;
  event.target.value = v;
}

function onFocus(event) {
  selected_index = event.target.name;
  updateFocus();
}

function onCurrencyChange(event) {
  var option = event.target.options[event.target.selectedIndex];
  localStorage.setItem(event.target.id, option.value);
  updateFlag(event.target.name, option.value);
  convertAll();
}

function onValueChange(event) {
  var v = event.target.value.split(",").join("");
  event.target.value = comma(v);
  convertAll();
}

function showButton(t, v) {
  document.getElementById(t).disabled = !v;
}

function convertAll() {
  var v = document.getElementById("v" + selected_index).value.split(",").join("");
  if (isNaN(v)) {
    return;
  }

  localStorage.setItem("last_idx", selected_index);
  localStorage.setItem("last_val", v);

  var c = document.getElementById("c" + selected_index);
  var o = c.options[c.selectedIndex];
  var f = o.value;

  for (i = 0; i < currency_count; i++) {
    if (selected_index == i) {
      continue;
    }
    var e = document.getElementById("v" + i);
    var c = document.getElementById("c" + i);
    var o = c.options[c.selectedIndex];
    var t = o.value;
    if (f == t || v == "") {
      e.value = v;
    }
    else {
      convert(e, v, f, t);
    }
  }
}

function convert(e, v, f, t) {
  e.value = "converting...";
  background.convert(v, f, t, function (response) {
    if (response.status == "error") {
      e.value = "please retry.";
      //e.value = e.value + ".";
    }
    else {
      e.value = response.value;
      document.getElementById("lastupdate").innerHTML = response.lastupdate;
    }
  });
}

function updateFlag(id, c) {
  if (c == null || c == "") {
    c = "USD";
  }
  document.getElementById("fg" + id).src = "flag/" + c.substr(0, 2).toLowerCase() + ".png";
}

function updateFocus() {
  var v = document.getElementById("v" + selected_index).value;

  localStorage.setItem("last_idx", selected_index);
  localStorage.setItem("last_val", v);

  document.getElementById("ch" + selected_index).src = "img/checked.gif";
  for (i = 0; i < currency_count; i++) {
    if (selected_index == i) {
      continue;
    }
    document.getElementById("ch" + i).src = "img/clear.gif";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("convert").addEventListener("click", convertAll);
  document.getElementById("insertRow").addEventListener("click", function () { insertRow(false); });
  document.getElementById("deleteRow").addEventListener("click", deleteRow);
  document.getElementById("moreInfo").addEventListener("click", moreInfo);
  init();
});
