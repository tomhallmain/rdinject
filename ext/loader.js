
function loadScript(fileName) {
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL(fileName);
  s.onload = function() { this.remove() };
  (document.head || document.documentElement).appendChild(s);
};

files = ['helpers.js', 'base.js', 'agent.js', 'reporter.js']
files.map( file => loadScript(file) );

chrome.runtime.onMessage.addListener(messageHandler);

function messageHandler(message) {
  console.log('Content script received message: ' + message);
  event = (function(message) {
    switch (message) {
      case 'userPostStats':   return 'ups()';               break;
      case 'getDebates':      return 'getDebates()';        break;
      case 'highlightActive': return 'highlightActive()';   break;
      case 'wordCounts':      return 'wcg(wordCounts())';   break;
      case 'ngrams':          return 'wcg(ngramsCounts())'; break;
      case 'up':              return 'up()';                break;
      case 'down':            return 'down()';              break;
      case 'echo':            return 'echoChamber()';       break;
      case 'normalize':       return 'normalizeScores()';   break;
      default: console.log('Message not understood');
    };
  })(message);
  console.log(event);
  if (event) fireEvent(event);
};

function fireEvent(toFire) {
  var s = document.createElement('script');
  s.appendChild(document.createTextNode(toFire + ';'));
  (document.head || document.documentElement).appendChild(s);
};


