
// Setup

document.addEventListener('DOMContentLoaded', function() {
  var searchUsers = document.querySelector('.searchUsers');
  var searchPosts = document.querySelector('.searchPosts');
  mapBtn( select('.userPostStats'), 'userPostStats'  );
  mapBtn( select('.getDebates'),    'getDebates'     );
  mapBtn( select('.mostActive'),    'highlightActive');
  mapBtn( select('.wordCounts'),    'wordCounts'     );
  mapBtn( select('.ngrams'),        'ngrams'         );
  mapBtn( select('.up'),            'up'             );
  mapBtn( select('.down'),          'down'           );
  mapBtn( select('.echo'),          'echo'           );
  mapBtn( select('.normalize'),     'normalize'      );
  searchUser.addEventListener();
  searchPosts.addEventListener();
});

function select(className) {
  return document.querySelector(className);
}

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

function mapBtn(btn, msg) {
  btn.addEventListener('click', function() { btnPressed(msg) });
};

function btnPressed(msg) {
  console.log('button pressed for ' + msg);
  sendMsg(msg);
};

function searchUsers(string) {

};
function searchPosts(string) {

};


