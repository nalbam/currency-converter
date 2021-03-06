
function round(n, c) {
  if (c >= 0) return parseFloat(n.toFixed(c));
  c = Math.pow(10, c);
  var t = Math.round(n * c) / c;
  return parseFloat(t.toFixed(0));
}

function comma(n) {
  var reg = /(^[+-]?\d+)(\d{3})/;
  n += "";
  while (reg.test(n)) {
    n = n.replace(reg, "$1" + "," + "$2");
  }
  return n;
}

Date.prototype.format = function (f) {
  if (!this.valueOf()) return "";
  var d = this;
  return f.replace(/(yyyy|yy|MM|dd|hh|mm|ss)/gi, function ($1) {
    switch ($1) {
      case "yyyy": return d.getFullYear();
      case "yy": return (d.getFullYear() % 1000).zf(2);
      case "MM": return (d.getMonth() + 1).zf(2);
      case "dd": return d.getDate().zf(2);
      case "HH": return d.getHours().zf(2);
      case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case "mm": return d.getMinutes().zf(2);
      case "ss": return d.getSeconds().zf(2);
      default: return $1;
    }
  });
};

String.prototype.string = function (len) { var s = "", i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };
