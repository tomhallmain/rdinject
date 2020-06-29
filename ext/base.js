// Conditional Settings On Page Load

document.getElementsByTagName('body')[0].style.filter = "brightness(80%)"
document.getElementsByTagName('body')[0].style.backgroundColor = "#92a8d1"

const baseUrl = 'https://www.reddit.com/'
const initialLink = window.location.href;
const postLinkRe = /reddit\.com\/r\/[-_A-Za-z]+\/comments/;
const showQuery = '?limit=500';
const postLink = postLinkRe.test(initialLink);
const showing500Posts = initialLink.includes(showQuery);

//if (postLink && !showing500Posts) {
//  if (postCommentCount() > 400) {
//    window.location.replace(initialLink + showQuery)
//  };
//};

if (postLink && (postCommentCount() > 600 || postCommentCount() <= 400)) { 
  expandPosts()
  window.scrollTo(0, 0)
};



// General Methods


function getOriginalPosts() {
  return [].slice.call(document.querySelectorAll('.thing.odd'))
    .concat([].slice.call(document.querySelectorAll('.thing.even')));
};
function getOriginalPost() {
  return getOriginalPosts().filter( p => p.dataset.type == 'link' )[0];
};
function postCommentCount() {
  return parseInt(getOriginalPost().dataset.commentsCount);
};

function check(posts) { return posts || getPosts(); };

function getPosts(post) {
  var base = post || document;
  return [].slice.call(base.getElementsByClassName('thing comment'));
};
function getExpandedPosts() { 
  return [].slice.call(document.getElementsByClassName('thing noncollapsed comment'));
};


function getUsers(posts) {
  posts = check(posts);
  var users = posts.map( post => post.dataset.author);
  return [... new Set(users)].filter( user => user != null );
};
function getActiveUsers(posts, numPosts) {
  posts = check(posts);
  var activeUsers = postCountsByUser(posts, numPosts || 2).map( user => user.user );
  return [... new Set(activeUsers)].filter( user => user != null );
};
function mostActive(numUsers) {
  return postCountsByUser(null, 3).slice(0, numUsers || 10);
};
function mostActiveTable(numUsers) {
  var mostActiveUsers = mostActive();
  console.table(mostActiveUsers); 
};
function getControversialUsers(posts) {
  var users = getActiveUsers();
  return users.filter( user => getHighPosts([user]).length > 0 && getLowPosts([user]).length > 0 );
};
function scrollUser(user, postIndex) {
  scroll(getUserPosts(user)[postIndex || 0]);
};
function goUser(user) {
  if (typeof(user) != 'string' || user.length < 1) {
    console.log('Please provide a username in string form')
    return;
  } else {
    var url = baseUrl + "u/" + user;
    openInNewTab(url);
  };
};

function replyCount(post) { return parseInt(post.dataset.replies); };

function postDepth(post) {
  if (post == null) { return -1 };
  if (getOriginalPost() === post) { return 0 };
  var counter = 1
  while (getParentPost(post)) { counter++; post = getParentPost(post) };
  return counter
};
function postTime(post) {
  var time = post?.getElementsByTagName('time')[0]?.getAttribute('datetime');
  if (time) { return strToDate(time); } else { return false; };
}
function postScore(post) {
  var score = post.getElementsByClassName('score unvoted')[0];
  return ( score ? parseInt(score.getAttribute('title')) : 1 )
};
function getHighPosts(users) {
  if ( empty(users) ) {
    return getPosts().reduce( (p,c) => (postScore(c) > 1 && p.push(c),p), []);
  } else {
    var posts = new Array;
    for (var i = 0; i < users.length; i++) {
      var userHighPosts = getUserPosts(users[i]).reduce((p,c) => (postScore(c) > 1 && p.push(c),p), []);
      posts = posts.concat(userHighPosts);
    };
    return posts;
  };
};
function getLowPosts(users) {
  if ( empty(users) ) {
    return getPosts().reduce( (p,c) => (postScore(c) <= 0 && p.push(c),p), []); 
  } else {
    var posts = new Array
    for (var i = 0; i < users.length; i++) {
      var userLowPosts = getUserPosts(users[i]).reduce((p,c) => (postScore(c) <= 0 && p.push(c),p), []);
      posts = posts.concat(userLowPosts);
    };
    return posts;
  };
};
function getSingleVotePosts(users) {
  if (users == null || users == []) {
    return getPosts().reduce( (p,c) => (postScore(c) == 1 && p.push(c),p), []); 
  } else {
    var posts = new Array
    for (var i = 0; i < users.length; i++) {
      var userLowPosts = getUserPosts(users[i]).reduce((p,c) => (postScore(c) == 1 && p.push(c),p), []);
      posts = posts.concat(userLowPosts);
    };
    return posts;
  };
};
function getPostsInScoreRange(min, max, users) {
  if (users == null || users == []) {
    return getPosts().reduce( (p,c) => (postScore(c) <= max && postScore(c) >= min && p.push(c),p), []); 
  } else {
    var posts = new Array
    for (var i = 0; i < users.length; i++) {
      var userLowPosts = getUserPosts(users[i]).reduce((p,c) => {
        (postScore(c) <= max && postScore(c) >= min && p.push(c),p), [];
      });
      posts = posts.concat(userLowPosts);
    };
    return posts;
  };
};



function postRemoved(post) {
  return postTag(post)?.querySelector('em')?.textContent == '[deleted]';
};
function removedPosts(posts) {
  posts = check(posts)
  return posts.filter( post => postRemoved(post) );
};
function nonremovedPosts(posts) {
  posts = check(posts)
  return posts.filter( post => !postRemoved(post) );
};
function modPost(post) {
  return postTag(post)?.querySelector('.moderator') != null || post.dataset.author == 'AutoModerator';
};
function modPosts(posts) {
  posts = check(posts);
  return posts.filter( post => modPost(post) );
};
function getMorePostsLinks(posts) {
  if (posts) {
    return posts.map( post => post.getElementsByClassName('thing noncollapsed morechildren') );
  } else {
    return [].slice.call(document.getElementsByClassName('thing noncollapsed morechildren'));
  };
};
function getExpanders(posts) {
  if (posts) {
    return posts.map( post => post.getElementsByClassName('expand')[0] ).flat();
  } else {
    return [].slice.call(document.getElementsByClassName('expand'));
  };
};
function getCollapsedPosts(posts) {
  if (posts) {
    return posts.filter( post => post.className.indexOf(' collapsed ') > -1 );
  } else {
    return [].slice.call(document.getElementsByClassName('thing collapsed comment'));
  };
};
function noncollapsedPosts(posts) {
  if (posts) {
    return posts.filter( post => post.className.indexOf(' noncollapsed ') > -1 );
  } else {
    return [].slice.call(document.getElementsByClassName('thing noncollapsed comment'));
  };
};
function postsHidden(posts) {
  var nMorePosts = getMorePostsLinks(posts).length;
  var nHiddenPosts = getCollapsedPosts(posts).length;
  if (nMorePosts > 0 || nHiddenPosts > 0) {
    console.log('Load more posts links found: ' + nMorePosts);
    console.log('Hidden posts found: ' + nHiddenPosts);
    return true;
  } else {
    return false;
  };
};
function loadMorePosts(posts) {
  var loadPostsLinksAll = getMorePostsLinks()
  var endLoadPostLink = loadPostsLinksAll.length > 14 && getLast(loadPostsLinksAll);
  var loadPostsLinks = loadPostsLinksAll.slice(0, 15);
  for (var i = 0; i < loadPostsLinks.length; i++) {
    loadPostsLinks[i].getElementsByTagName('a')[0].click();
    console.log('clicked load posts link ' + i);
    sleep(400);
  };
  if (endLoadPostLink) {
    endLoadPostLink.getElementsByTagName('a')[0].click();
    console.log('clicked end load posts link');
  };
};
function openCollapsedPosts(posts) {
  var collapsedPosts = getCollapsedPosts(posts);
  var expanders = getExpanders(collapsedPosts);
  expanders.map( (el,i) => setTimeout(el.click(), i*200) );
  if (collapsedPosts.length > 0) console.log('Expanded ' + collapsedPosts.length + ' collapsed posts');
};
function expandPosts(posts) {
  if (postsHidden(posts)) {
    loadMorePosts(posts);       sleep(1000);
    openCollapsedPosts(posts);  sleep(1000);
  } else {
    console.log('No posts to expand!');
  };
};
function collapsePosts(posts, upToLevel) {
  posts = noncollapsedPosts(posts);
  if (posts.length > 0) {
    posts = posts.filter( post => postDepth(post) == (upToLevel || 1) );
    var expanders = getExpanders(posts);
    expanders.map( (el,i) => setTimeout(el.click(), i*200) );
  } else {
    console.log('No posts found to expand among posts provided!')
  };
};


function getUserPosts(users) {
  if (users.length == 0) {
    console.log('Please provide a username or list of users in an array.');
    return;
  } else if (typeof(users) == 'string') {
    users = [users];
  };
  return getPosts().reduce( (p,c) => (users.indexOf(c.dataset.author) > -1 && p.push(c),p), [] );
};
function getOpComments() {
  return getPosts().reduce( (p,c) => (c?.querySelector('.userattrs')?.querySelector('.submitter') && p.push(c),p), [] );
};



function getBasePosts() { 
  var chainPosts = getPosts().filter( post => replyCount(post) > 0 );
  return chainPosts.filter( post => getParentPost(post) == null );;
};
function getParentPost(post) {
  if (post == null) return null;
  const parentComment = post.parentElement.parentElement.parentElement;
  return (parentComment?.dataset?.type == 'comment' ? parentComment : null);
};
function getGrandparentPost(post) {
  if (post == null) return null;
  const grandparent = getParentPost(getParentPost(post));
  return (grandparent?.dataset?.type == 'comment' ? grandparent : null);
};
function getChildPosts(post) {
  return getPosts(post);  
};
function postTag(post) {
  return post.querySelector('.tagline');
};
function userAttrs(post) {
  return post.querySelector('.userattrs');
};


function getPostText(post) {
  var text = post.getElementsByClassName('usertext-body')[0].textContent;
  return (typeof(text) == 'string' ? text.slice(0,-2) : '');
};
function postLength(post) {
  return getPostText(post).length;
};
function hasProfanity(post) {
  var text = getPostText(post).toLowerCase();
  const profanityDict = ['fuck', ' shit', ' piss', ' bitch', ' cunt']
  return profanityDict.some( word => text.indexOf(word) != -1 )
};
function getProfanePosts(posts) {
  posts == check(posts);
  return posts.reduce( (p,c) => (hasProfanity(c) && p.push(c),p), []);
};
function searchPosts(string, cased, posts, user) {
  posts = posts || (user == null ? getPosts() : getUserPosts(user));
  if (cased) { 
    return posts.reduce( (p,c) => (getPostText(c).indexOf(string) != -1 && p.push(c),p), []);
  } else {
    return posts.reduce( (p,c) => (getPostText(c).toLowerCase().indexOf(string.toLowerCase()) != -1 && p.push(c),p), []);
  };
};
function searchPostsRegex(regex, posts, user) {
  try { 
    regex = new RegExp(regex);
  } catch(e) {
    console.log('Input is not a valid regular expression!');
    return false;
  };
  posts == null ? posts = (user == null ? getPosts() : getUserPosts(user)) : null;
  return posts.reduce( (p,c) => ( regex.test(getPostText(c)) && p.push(c),p), []);
};


function getDebates() {
  var debates = new Array;
  colorset = ['red', 'blue', 'green', 'orange', 'purple', 'gray', 'pink',
    'black', 'yellow', 'saddlebrown', 'maroon']
  getBasePosts().map( (basePost) => {
    var children = getChildPosts(basePost);
    var leaves = children.filter( post =>
      getChildPosts(post).length <= 1 && getParentPost(getGrandparentPost(post)) != null
    );
    if (leaves.some( leaf => getGrandparentPost(leaf)?.dataset.author == leaf.dataset.author )) {
      var debaters = postCountsByUser(children, 2).map( user => user.user );
      var debateBase = {
        basePost: basePost,
        basePostAuthor: basePost.dataset.author,
        debaters: debaters,
        debatePosts: []
      };
      debaters.map( (user, i) => {
        color = colorset[i % colorset.length];
        posts = getUserPosts(user);
        debateBase.debatePosts.push(posts)
        posts.map( post => {
          postTag(post).style.backgroundColor = color;
          postTag(post).style.color = 'white'
        });
      });
      debateBase.debatePosts = debateBase.debatePosts.flat()
      postTag(basePost).style.fontWeight = 'bold'
      userAttrs(basePost).textContent = (userAttrs(basePost).textContent 
        + '(Debated post: ' + debateBase.debaters.length + ' debaters)')
      debates.push(debateBase);
    };
  });
  scroll(debates[0].basePost);
  return debates;
};


function highlightActive() {
  var postCounts = mostActive();
  var users = postCounts.map(user => user.user);
  var posts = getUserPosts(users).flat();
  posts.map( post => {
    attrs = userAttrs(post);
    attrs.textContent = (attrs.textContent + '(' 
      + postCounts[users.indexOf(post.dataset.author)].postCount + ' posts found)');
    userAttrs(post).style.color = 'crimson';
    userAttrs(post).style.fontWeight = 'bold';
    userAttrs(post).style.visibility = 'visible';
  });
  return postCounts;
};



