
// Handle writing to document

files = ['helpers.js', 'base.js', 'agent.js', 'reporter.js', 'setup.js']
files.map( file => {
  loadScript(file)
  const date = Date.now()
  while (Date.now() - date < 80);
});

function loadScript(fileName) {
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL(fileName);
  s.onload = function() { this.remove() };
  appendScript(s);
};

function fireEvent(toFire) {
  var s = document.createElement('script');
  s.appendChild(document.createTextNode(toFire));
  s.onload = function() { this.remove() };
  appendScript(s);
};

function appendScript(script) {
  (document.head || document.documentElement).appendChild(script);
};

function checkScript(scriptId) {
  var script = document.querySelector();
  script.addEventListener('load', function() {
    hljs.initHighlightingOnLoad(); 
  });
}


// Handle messages

chrome.runtime.onMessage.addListener(messageHandler);

function messageHandler(message) {
  console.log('Content script received message: ');
  console.log(message);
  var selection = message['buttonPressed'];
  if (message['searchUsers'] == null && message['searchPosts'] == null) { 
    var postFilter = 'getPosts()'
  } else {
    var user = (message['searchUsers'] ? "'" + message['searchUsers'] + "'" : 'null');
    var textSearch = message['searchPosts'];
    var postFilter = ( 
      textSearch ? 
      'searchPosts(' + "'" + textSearch + "'" + ', null, null, ' + user + ')'
      : 'getUserPosts(' + user + ')'
    );
  };
  var event = (function(selection, user, postFilter) {
    switch (selection) {
      case 'userPostStats':   return 'ups(' + user + ')'; break;
      case 'getDebates':      return 'getDebates()'; break;
      case 'highlightActive': return 'highlightActive()'; break;
      case 'wordCounts':      return 'wcg(' + postFilter + ')'; break;
      case 'ngrams':          return 'ngr(' + postFilter + ')'; break;
      case 'up':              return 'up(' + postFilter + ')'; break;
      case 'down':            return 'down(' + postFilter + ')'; break;
      case 'echo':            return 'echoChamber()'; break;
      case 'normalize':       return 'normalizeScores()'; break;
      case 'scroll':          return 'scroll(' + postFilter + ')'; break;
      case 'next':            return 'nextPage()'; break;
      case 'expand':          return 'expandPosts()'; break;
      case 'collapse':        return 'collapsePosts(' + postFilter + ')'; break;
      default: console.log('Message not understood');
    };
  })(selection, user, postFilter);
  console.log(event);
  if (event) fireEvent(event);
};

