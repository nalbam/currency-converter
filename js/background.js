
var name = "currency";

var cache = { "USD": "1", "KRW": "1000", "EUR": "1" };
var loaded = false;
var update = new Date();

refresh();
setInterval(refresh, 10 * 60 * 1000);

function refresh() {
  setBadge("loading...", "..", [200, 200, 200, 255]);
  var r = new Date().getTime();
  var x = new XMLHttpRequest();
  x.open("GET", "http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json", true);
  x.onload = function () {
    loaded = true;
    update = new Date();
    var c = JSON.parse(x.responseText);
    for (var i = 0; i < c.list.resources.length; i++) {
      try {
        var resource = c.list.resources[i].resource;
        var key = resource.fields.symbol.replace("=X", "");
        cache[key] = resource.fields.price;
      }
      catch (err) {
        continue;
      }
    }
    setBadge("Currency Converter", "", [0, 0, 0, 255]);
  }
  x.send(null);
  setTimeout(function () { if (loaded == false) { x.abort(); } }, 15 * 1000);
}

function convert(v, f, t, cb) {
  var timer = setTimeout(function () { cb({ status: "error" }); }, 5 * 1000);
  setTimeout(function () { convertRecursive(v, f, t, cb, timer); }, 100);
}

function convertRecursive(v, f, t, cb, timer) {
  var f_rate = cache[f];
  var t_rate = cache[t];
  if (loaded == false || f_rate == undefined || t_rate == undefined) {
    setTimeout(function () { convertRecursive(v, f, t, cb, timer); }, 500);
    return;
  }
  clearTimeout(timer);
  var converted = comma(round((v / f_rate) * t_rate, 2));
  cb({ status: "success", value: converted, lastupdate: update.format("yyyy-MM-dd HH:mm") });
}
