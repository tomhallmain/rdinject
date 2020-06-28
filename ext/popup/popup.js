
// Setup

document.addEventListener('DOMContentLoaded', function() {
  var postStatsButton = document.querySelector('.userPostStats');
  var debatesButton = document.querySelector('.getDebates');
  var mostActiveButton = document.querySelector('.mostActive');
  var wordCountsButton = document.querySelector('.wordCounts');
  var ngramsButton = document.querySelector('.ngrams');
  var searchUsers = document.querySelector('.searchUsers');
  var searchPosts = document.querySelector('.searchPosts');
  postStatsButton.addEventListener('click', function() { postStatsBtnPressed() });
  debatesButton.addEventListener('click', function() { getDebatesBtnPressed() });
  mostActiveButton.addEventListener('click', function() { mostActiveBtnPressed() });
  wordCountsButton.addEventListener('click', function() { wordCountsBtnPressed() });
  ngramsButton.addEventListener('click', function() { ngramsBtnPressed() });
});


// Message passing

let activeTabParams = {
  active: true,
  currentWindow: true
};
function sendMsg(msg) {
  chrome.tabs.query(activeTabParams, messagePush);
  function messagePush(tabs) {
    console.log(msg);
    console.log(tabs[0]);
    chrome.tabs.sendMessage(tabs[0].id, msg);
  };
};


// Actions

function getDebatesBtnPressed() { 
  console.log('button pressed');
  sendMsg('getDebates');
};
function mostActiveBtnPressed() { 
  console.log('button pressed');
  sendMsg('highlightMostActive');
};
function postStatsBtnPressed() { 
  console.log('button pressed');
  sendMsg('userPostStatistics');
};
function wordCountsBtnPressed() { 
  console.log('button pressed');
  sendMsg('wordCounts');
};
function ngramsBtnPressed() { 
  console.log('button pressed');
  sendMsg('ngrams');
};

