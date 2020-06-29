
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
  switch (message) {
    case 'userPostStats':   fireEvent('ups()'); break;
    case 'getDebates':      fireEvent('getDebates()'); break;
    case 'highlightActive': fireEvent('highlightActive()'); break;
    case 'wordCounts':      fireEvent('wcg(wordCounts())'); break;
    case 'ngrams':          fireEvent('wcg(ngramsCounts())'); break;
    case 'up':              fireEvent('up()'); break;
    case 'down':            fireEvent('down()'); break;
    case 'echo':            fireEvent('echoChamber()'); break;
    case 'normalize':       fireEvent('normalizeScores()'); break;
    default: console.log('Message not understood');
  };
};

function fireEvent(toFire) {
  var s = document.createElement('script');
  s.appendChild(document.createTextNode(toFire + ';'));
  (document.head || document.documentElement).appendChild(s);
};


