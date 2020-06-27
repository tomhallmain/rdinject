
// listen for our browserAction to be clicked
//chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
//	chrome.tabs.executeScript(tab.id, {
//		file: 'inject.js'
//	});
//});

function createScript(fileName) {
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL(fileName);
  s.onload = function() { this.remove() };
  (document.head || document.documentElement).appendChild(s);
};

files = ['helpers.js', 'base.js', 'agent.js', 'reporter.js']
files.map( file => createScript(file) );


