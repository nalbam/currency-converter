
function moreInfo() {
  //chrome.tabs.create({url: "http://m.nalbam.com"});
}

function getVersion() {
  //var d = chrome.app.getDetails();
  return "web"; //d.version;
}

function getBackgroundPage() {
  return null; //chrome.extension.getBackgroundPage();
}

function setBadge(_title, _text, _color) {
  //chrome.browserAction.setTitle({title:_title});
  //chrome.browserAction.setBadgeText({text:_text});
  //chrome.browserAction.setBadgeBackgroundColor({color:_color});
}
