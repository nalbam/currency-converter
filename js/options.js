
function restoreOptions() {
  document.getElementById("version").innerHTML = getVersion();
}

document.addEventListener("DOMContentLoaded", function () {
  restoreOptions();
});
