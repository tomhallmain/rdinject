
// Setup

var filterSettings = {};

document.addEventListener('DOMContentLoaded', function() {
  mapBtn( select('.userPostStats'), 'userPostStats'  );
  mapBtn( select('.getDebates'),    'getDebates'     );
  mapBtn( select('.mostActive'),    'highlightActive');
  mapBtn( select('.wordCounts'),    'wordCounts'     );
  mapBtn( select('.ngrams'),        'ngrams'         );
  mapBtn( select('.up'),            'up'             );
  mapBtn( select('.down'),          'down'           );
  mapBtn( select('.echo'),          'echo'           );
  mapBtn( select('.normalize'),     'normalize'      );
  mapBtn( select('.scroll'),        'scroll'         );
  mapBtn( select('.reserved'),      'reserved'       );
  mapInput( select('.searchUsers')  );
  mapInput( select('.searchPosts')  );
});

function select(className) {
  return document.querySelector(className);
}
function mapBtn(btn, msgVal) {
  btn.addEventListener('click', function() { btnPressed(msgVal) });
};
function mapInput(input) {
  input.addEventListener('change', function() { 
    updateFilter(input.className, input.value);
  });
};

// Message passing

let activeTabParams = {
  active: true,
  currentWindow: true
};
function sendMsg(message, filterSettings) {
  chrome.tabs.query(activeTabParams, messagePush);
  function messagePush(tabs) {
    console.log(message);
    console.log({'tab': tabs[0]});
    chrome.tabs.sendMessage(tabs[0].id, message);
  };
};


// Actions

function btnPressed(msgVal) {
  console.log('button pressed for ' + msgVal);
  sendMsg(applyFilter({'buttonPressed': msgVal}));
};

function applyFilter(msg) {
  return Object.assign({}, msg, filterSettings);
};

function updateFilter(inputClass, input) {
  filterSettings[inputClass] = input;
  console.log('changed filter for ' + inputClass + ' to ' + input);
};



