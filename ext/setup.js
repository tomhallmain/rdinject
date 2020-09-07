
// Conditional Settings On Page Load

document.getElementsByTagName('body')[0].style.filter = "brightness(80%)";
document.getElementsByTagName('body')[0].style.backgroundColor = "#92a8d1";

const baseUrl = 'https://www.reddit.com/';
const initialLink = window.location.href;
const postLinkRe = /reddit\.com\/r\/[-_A-Za-z]+\/comments/;
const postLink = postLinkRe.test(initialLink);

function buildButton(text, className, script, parentElement) {
  var b = document.createElement('button')
  b.textContent = text;
  b.className = className;
  b.setAttribute('onclick', script);
  parentElement?.appendChild(b);
}

var observeDOM = (function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj || !obj.nodeType === 1 ) return; // validation
    if( MutationObserver ){
      // define a new observer
      var obs = new MutationObserver(function(mutations, observer){
        callback(mutations);
      })
      // have the observer observe foo for changes in children
      obs.observe( obj, { childList:true, subtree:true });
    }

    else if( window.addEventListener ){
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  }
})();


adContainers = [].slice.call(document.getElementsByClassName('ad-container '));
premium = [].slice.call(document.querySelectorAll('.premium-banner-outer'));
[].slice.call(document.querySelectorAll('.promotedlink')).map( el => el.innerHTML = '' );
adContainers.map( el => el.parentElement.innerHTML = '' );
premium.map( el => el.parentElement.innerHTML = '' );


// Async handling

function sleepAsync(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadData(func, callback) {
  while(typeof func !== "function") {
    await sleepAsync(200);
  }
  callback();
}

if (postLink) {
  while (n_scripts<4) { sleepAsync(120) }
  loadData(postCommentCount, function() {
    commentCount = postCommentCount();
  });
  if (commentCount > 600) {
    expandPosts();
  }
  loadData(getPosts, function() {
    getPosts().forEach( p => {
      var u = p.dataset.author;
      buildButton('U', 'ub', 'uup("' + u + '")', postTag(p));
      buildButton('D', 'db', 'dup("' + u + '")', postTag(p));
    });
  });
  if (typeof postCountsByUser != 'undefined') {
    highlightActive();
    getDebates();
  }
  window.scrollTo(0, 0);
}




