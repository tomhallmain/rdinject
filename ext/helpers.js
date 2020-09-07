
// Helper Methods

debug = false;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do { currentDate = Date.now(); }
  while (currentDate - date < milliseconds);
}
function scroll(args) {
  var element = (Array.isArray(args) ? args[0] : args);
  element.scrollIntoView();
}
function sortUncased(arr) {
  return arr.sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}
function sum(arr) {
  return (arr.length == 0 || arr[0].length == 0 ? 0 : arr.reduce((a,b) => a + b));
}
function loglog(n) {
  return Math.log(Math.log(n));
}
function strToDate(timestring) {
  if ( typeof(timestring) != 'string' ) return false;
  try { return new Date(timestring); }
  catch(e) {
    if (debug) console.log('Input is not a valid datetime string!');
    return false;
  }
}
function empty(data) {
  if (data === null) return true;
  switch (typeof(data)) {
    case 'number':    return false; break;
    case 'boolean':   return false; break;
    case 'undefined': return true;  break;
  }
  if (typeof(data.length) != 'undefined') return data.length == 0;
  var count = 0;
  for (var i in data) { if (data.hasOwnProperty(i)) count++ }
  return count == 0;
}
function getLast(arr) {
  return arr.slice(-1)[0];
}
function getBrowserWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}
function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}
function chanceFilter(arr, chance) {
  return arr.filter( () => Math.random() < chance );
}

if (!n_scripts) var n_scripts = 0;
n_scripts++
