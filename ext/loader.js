
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
  console.log('Content script received message: ');
  console.log(message);
  var selection = message['buttonPressed'];
  var user = (message['searchUsers'] ? "'" + message['searchUsers'] + "'" : 'null');
  var textSearch = message['searchPosts'];
  const postFilter = ( 
    textSearch ? 'searchPosts(' + "'" + textSearch + "'" + ', null, null, ' + user + ')' :
    'searchPostsRegex("*", null, null, ' + user + ')'
  );
  var event = (function(selection, user, postFilter) {
    switch (selection) {
      case 'userPostStats':   return 'ups(' + user + ')'; break;
      case 'getDebates':      return 'getDebates()'; break;
      case 'highlightActive': return 'highlightActive()'; break;
      case 'wordCounts':      return 'wcg(wordCounts(' + postFilter + '))'; break;
      case 'ngrams':          return 'wcg(ngramsCounts(' + postFilter + '))'; break;
      case 'up':              return 'up(' + postFilter + ')'; break;
      case 'down':            return 'down(' + postFilter + ')'; break;
      case 'echo':            return 'echoChamber()'; break;
      case 'normalize':       return 'normalizeScores()'; break;
      case 'scroll':          return 'scroll(' + postFilter + ')'; break;
      case 'reserved':        return ''; break;
      default: console.log('Message not understood');
    };
  })(selection, user, postFilter);
  console.log(event);
  if (event) fireEvent(event);
};

function fireEvent(toFire) {
  var s = document.createElement('script');
  s.appendChild(document.createTextNode(toFire + ';'));
  (document.head || document.documentElement).appendChild(s);
};


