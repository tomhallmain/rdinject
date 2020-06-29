
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
  event = (switch (message) {
    case 'userPostStats':   'ups()';               break;
    case 'getDebates':      'getDebates()';        break;
    case 'highlightActive': 'highlightActive()';   break;
    case 'wordCounts':      'wcg(wordCounts())';   break;
    case 'ngrams':          'wcg(ngramsCounts())'; break;
    case 'up':              'up()';                break;
    case 'down':            'down()';              break;
    case 'echo':            'echoChamber()';       break;
    case 'normalize':       'normalizeScores()';   break;
    default: console.log('Message not understood');
  });
  if (event) fireEvent(event);
};

function fireEvent(toFire) {
  var s = document.createElement('script');
  s.appendChild(document.createTextNode(toFire + ';'));
  (document.head || document.documentElement).appendChild(s);
};


