
// Conditional Settings On Page Load

document.getElementsByTagName('body')[0].style.filter = "brightness(80%)";
document.getElementsByTagName('body')[0].style.backgroundColor = "#92a8d1";

const baseUrl = 'https://www.reddit.com/';
const initialLink = window.location.href;
const postLinkRe = /reddit\.com\/r\/[-_A-Za-z]+\/comments/;
const postLink = postLinkRe.test(initialLink);

/*
const showQuery = '?limit=500';
const showing500Posts = initialLink.includes(showQuery);
if (postLink && !showing500Posts) {
  if (postCommentCount() > 400) {
    window.location.replace(initialLink + showQuery)
  };
};
*/

if (postLink && (postCommentCount() > 600)) {
  expandPosts();
  window.scrollTo(0, 0);
};


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

/*
observeDOM( document, function(m) {
  m.forEach( record => {
    var added = record.addedNodes[0];
    if (/^ad-/.test(added?.className)) { 
      added.innerHTML = '';
    };
  });
});
*/


adContainers = [].slice.call(document.getElementsByClassName('ad-container '));
premium = [].slice.call(document.querySelectorAll('.premium-banner-outer'));
[].slice.call(document.querySelectorAll('.promotedlink')).map( el => el.innerHTML = '' );
adContainers.map( el => el.parentElement.innerHTML = '' );
premium.map( el => el.parentElement.innerHTML = '' );

