var s = document.createElement('script');

// listen for our browserAction to be clicked
//chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
//	chrome.tabs.executeScript(tab.id, {
//		file: 'inject.js'
//	});
//});

s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
