function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do { currentDate = Date.now(); }
  while (currentDate - date < milliseconds);
};
function scroll(args) {
  var element = (args.length > 1 ? args[0] : args);
  element.scrollIntoView();
};
function sortUncased(arr) {
  return arr.sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()));
};
function sum(arr) {
  return (arr.length == 0 || arr[0].length == 0 ? 0 : arr.reduce( (a,b) => a + b));
};
function strToDate(timestring) {
  if ( typeof(timestring) != 'string' ) return false;
  try { return new Date(timestring); }
  catch(e) {
    console.log('Input is not a valid datetime string!');
    return false;
  };
};
function empty(data) {
  if (data === null) return true;
  switch (typeof(data)) {
    case 'number':    return false; break;
    case 'boolean':   return false; break;
    case 'undefined': return true;  break;
  }
  if (typeof(data.length) != 'undefined') return data.length == 0;
  var count = 0;
  for (var i in data) { if (data.hasOwnProperty(i)) count++ }
  return count == 0;
}
function getBrowserWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}


// ----------------

function checkNull(posts) { return posts || getPosts(); };
function getPosts(post) {
  var base = post || document;
  return [].slice.call(base.getElementsByClassName('thing comment'));
};
function getExpandedPosts() { 
  return [].slice.call(document.getElementsByClassName('thing noncollapsed comment'));
};


function getUsers(posts) {
  posts = checkNull(posts);
  var users = posts.map( post => post.dataset.author);
  return [... new Set(users)].filter( user => user != null );
};
function getActiveUsers(posts) {
  posts = checkNull(posts);
  var activeUsers = postCountsByUser(posts, 2).map( user => user.user );
  return [... new Set(activeUsers)].filter( user => user != null );
};
function mostActive(numUsers) {
  var mostActiveUsers = postCountsByUser(null, 2).slice(0, numUsers || 10);
  console.table(mostActiveUsers); 
};
function getControversialUsers(posts) {
  var users = getActiveUsers();
  return users.filter( user => getHighPosts([user]).length > 0 && getLowPosts([user]).length > 0 );
};


function replyCount(post) { return parseInt(post.dataset.replies); };

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


function getPostText(post) {
  var text = post.getElementsByClassName('usertext-body')[0].textContent;
  return (typeof(text) == 'string' ? text.slice(0,-2) : '');
};
function hasProfanity(post) {
  var text = getPostText(post).toLowerCase();
  const profanityDict = ['fuck', ' shit', ' piss', ' bitch', ' cunt']
  return profanityDict.some( word => text.indexOf(word) != -1 )
};
function getProfanePosts(posts) {
  posts == checkNull(posts);
  return posts.reduce( (p,c) => (hasProfanity(c) && p.push(c),p), []);
};
function searchPosts(string, cased, posts, user) {
  if (posts == null) posts = (user == null ? getPosts() : getUserPosts(user));
  if (cased) { 
    return posts.reduce( (p,c) => (getPostText(c).indexOf(string) != -1 && p.push(c),p), []);
  } else {
    return posts.reduce( (p,c) => (getPostText(c).toLowerCase().indexOf(string) != -1 && p.push(c),p), []);
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


function getMorePostsLinks() {
  return [].slice.call(document.getElementsByClassName('thing noncollapsed morechildren'));
};
function getCollapsedPosts() {
  return [].slice.call(document.getElementsByClassName('thing collapsed comment'));
};
function postsHidden() {
  nMorePosts = getMorePostsLinks().length;
  nHiddenPosts = getCollapsedPosts().length;
  if (nMorePosts > 0 || nHiddenPosts > 0) {
    console.log('Load more posts links found: ' + nMorePosts);
    console.log('Hidden posts found: ' + nHiddenPosts);
    return true;
  } else {
    return false;
  };
};
function loadMorePosts() {
  var loadPostsLinks = getMorePostsLinks().slice(0, 15);
  for (var i = 0; i < loadPostsLinks.length; i++) {
    loadPostsLinks[i].getElementsByTagName('a')[0].click();
    console.log('clicked load posts link ' + i);
    sleep(400);
  };
};
function openCollapsedPosts() {
  var collapsedPosts = getCollapsedPosts();
  for (var i = 0; i < collapsedPosts.length; i++) {
    setTimeout(collapsedPosts[i].getElementsByClassName('expand')[0].click(), i*200);
  };
  if (collapsedPosts.length > 0) console.log('Expanded ' + collapsedPosts.length + ' collapsed posts');
};
function expandPosts() {
  if (postsHidden()) {
    loadMorePosts();       sleep(1000);
    openCollapsedPosts();  sleep(1000);
  } else {
    console.log('No posts to expand!');
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
function getDebates() {
  var debates = new Array;
  getBasePosts().map( (basePost) => {
    var children = getChildPosts(basePost);
    var leaves = children.filter( post =>
      getChildPosts(post).length <= 1 && getParentPost(getGrandparentPost(post)) != null
    );
    if (leaves.some( leaf => getGrandparentPost(leaf)?.dataset.author == leaf.dataset.author )) {
      postTag(basePost).style.backgroundColor = 'yellow'
      var debaters = postCountsByUser(children, 2).map( user => user.user );
      var debateBase = {
        basePost: basePost,
        basePostAuthor: basePost.dataset.author,
        debaters: debaters,
        debatePosts: []
      };
      debaters.map( (user, i) => {
        color = ['red', 'blue', 'green', 'orange', 'purple', 'gray'][i % 6];
        posts = getUserPosts(user);
        debateBase.debatePosts.push(posts)
        posts.map( post => postTag(post).style.backgroundColor = color );
      });
      debateBase.debatePosts = debateBase.debatePosts.flat()
      debates.push(debateBase);
    };
  });
  scroll(debates[0].basePost);
  return debates;
};



function unvotedPosts(posts) {
  posts = checkNull(posts);
  return posts.filter( post => post.querySelector('.entry.unvoted')?.parentElement == post );
};
function upvotedPosts(posts) {
  posts = checkNull(posts);
  return posts.filter( post => post.querySelector('.entry.likes')?.parentElement == post );
};
function downvotedPosts(posts) {
  posts = checkNull(posts);
  return posts.filter( post => post.querySelector('.entry.dislikes')?.parentElement == post );
};
function votedPosts(posts) {
  posts = checkNull(posts);
  return posts.filter( post => post.querySelector('.entry.unvoted')?.parentElement != post );
};
function getPostUpvotes(posts) {
  return posts.map( post => post.getElementsByClassName('arrow up')[0] );
};
function getPostDownvotes(posts) {
  return posts.map( post => post.getElementsByClassName('arrow down')[0] );
};
function voteAll(voteButtons) {
  for (var i = 0; i < voteButtons.length; i++) { 
    setTimeout(voteButtons[i]?.click(), i*1000); 
  };
};
function upvotePosts(posts) {
  if (posts.length == 0) {
    console.log('No posts found to upvote!');
    return;
  };
  voteAll(getPostUpvotes(posts));
  console.log('Upvoted ' + posts.length + ' posts');
};
function downvotePosts(posts) {
  if (posts.length == 0) {
    console.log('No posts found to downvote!');
    return;
  };
  voteAll(getPostDownvotes(posts));
  console.log('Downvoted ' + posts.length + ' posts');
};
function upvoteUserPosts(username) {
  var posts = getUserPosts(username); 
  if (posts.length == 0) {
    console.error('No posts found for user ' + username);
    return;
  };
  upvotePosts(posts);
  console.log('Upvoted ' + posts.length + ' posts found for user');
};
function downvoteUserPosts(username) {
  var posts = getUserPosts(username);
  if (posts.length == 0) {
    console.error('No posts found for user ' + username);
    return;
  };
  downvotePosts(posts);
  console.log('Downvoted ' + posts.length + ' posts found for user');
};

function up(posts) {
  posts = posts || unvotedPosts();
  randomVoting( posts, 0.7 );
}
function down(posts) {
  posts = posts || unvotedPosts();
  randomVoting( posts, 0.1, true, 0.7)
}
function normalizeScores() {
  var highPosts = getHighPosts();
  var lowPosts = getLowPosts();
  upvotePosts(lowPosts);
  downvotePosts(highPosts); 
  console.log('Upvoted ' + lowPosts.length + ' low score posts found');
  console.log('Downvoted ' + highPosts.length + ' high score posts found');
};
function echoChamber() {
  var highPosts = getHighPosts().filter( () => Math.random() < (voteChance || 0.7));
  var lowPosts = getLowPosts().filter( () => Math.random() < (voteChance || 0.7));
  upvotePosts(highPosts);
  downvotePosts(lowPosts);
  console.log('Upvoted ' + highPosts.length + ' high score posts found');
  console.log('Downvoted ' + lowPosts.length + ' low score posts found');
  console.log('Thanks for keeping the echo going!');
};
function randomVoting(posts, upvoteChance, includeDownvotes, downvoteChance) {
  posts = checkNull(posts);
  var upPosts = posts.filter( () => Math.random() < (upvoteChance || 0.5) );
  upvotePosts(upPosts);
  if (includeDownvotes) {
    var downPosts = posts.filter( post => upPosts.indexOf(post) == -1 )
    if (downvoteChance) { downPosts = downPosts.filter( () => Math.random() < (downvoteChance || 0.5) )};
    downvotePosts(downPosts);
  };
  console.log('Randomly voted on ' + posts.length + ' posts');
};
function randomDropVoting(posts, dropChance, upvoteChance) {
  posts = checkNull(posts);
  var dropPosts = posts.filter( () => Math.random() < (dropChance || 0.7) );
  votePosts = posts.filter( post => dropPosts.indexOf(post) == -1 );
  var upPosts = votePosts.filter( () => Math.random() < (upvoteChance || 0.7) );
  var downPosts = votePosts.filter( post => upPosts.indexOf(post) == -1 );
  upvotePosts(upPosts);
  downvotePosts(downPosts);
  console.log('Randomly voted on ' + votePosts.length + ' posts out of ' + posts.length + ' posts found.');
};
function assistControversial(posts) {
  posts = checkNull(posts);
  var users = getControversialUsers(posts);
  upvotePosts(getUserPosts(users));
  console.log('Upvoated posts for users: ' + users.join(', '));
};
function hinderProfane(posts) {
  posts = checkNull(posts);
  downvotePosts(getProfanePosts(posts));
};
function assistLowScore(posts, users, postCountMin) {
  posts = checkNull(posts);
  var lowUsers = postScoresByUser(users, postCountMin).filter( user =>
    user.scores.some( score => score < 1 )
    ).map( user => user.user );
  upvotePosts(getUserPosts(lowUsers));
  console.log('Upvoted posts for users: ' + lowUsers.join(', '));
};


function getCounts(userPosts, postCountMin) {
  var counts = new Array;
  var index = 0;
  userPosts.sort()
  var prev = userPosts[0];
  counts.push({user: userPosts[0], postCount: 1});
  for (var i = 1; i < userPosts.length; i++) {
    if (userPosts[i] !== prev) {
      counts.push({user: userPosts[i], postCount: 1});
      index++;
    } else {
      counts[index].postCount++;
    };
    prev = userPosts[i];
  };
  if (postCountMin == null) postCountMin = 1; 
  counts = counts.filter( user => user.postCount >= postCountMin );
  return counts.sort( (a,b) => b.postCount - a.postCount );
};
function postCountsByUser(posts, postCountMin) {
  posts = checkNull(posts)
  var authorsByPosts = posts.map( post => post.dataset.author );
  if (postCountMin == null) postCountMin = 1;
  var userPostCounts = getCounts(authorsByPosts, postCountMin);
  return userPostCounts;
};

function getPostScoresByUser(users, postCountMin) { 
  // assumes unique set of users provided
  var dataByUser = new Array;
  for (var i = 0; i < users.length; i++) {
    var userPosts = getUserPosts(users[i]);
    var postScores = new Array;
    var postScores = userPosts.map( post => postScore(post) );
    dataByUser.push({ user: users[i], scores: postScores, totalScore: sum(postScores), postCount: postScores.length });
  };
  if (postCountMin != null) dataByUser = dataByUser.filter( user => user.postCount >= postCountMin );
  for (var i = 0; i < dataByUser.length; i++) {
    var userPostCount = dataByUser[i].postCount
    if (userPostCount == 0) { 
      dataByUser[i].average = 0
    } else {
      dataByUser[i].average = Math.round(dataByUser[i].totalScore / userPostCount);
    };
  };
  return dataByUser.sort( (a,b) => b.totalScore - a.totalScore );
};
function postScoresByUser(users, postCountMin) {
  users == null ? users = getUsers() : (typeof(users) == 'string' ? users = [users] : null);
  if (postCountMin == null) userPostCount = 1;
  var userScoreCounts = getPostScoresByUser(users, postCountMin);
  return userScoreCounts;
};


function userPostStatistics(users, numUsers) {
  if (users == null) {
    var posts = getPosts();
    if (posts.length == 0) {
      console.log('No comments found!');
    } else {
      var maxScorePost = [...posts].sort( (a,b) => postScore(b) - postScore(a) )[0];
      var postScores = postScoresByUser(getUsers(posts));
      var postScoresByAverage = [].slice.call(postScores).sort( (a,b) => b.average - a.average);
      var postScoresByCount = [].slice.call(postScores).sort( (a,b) => b.postCount - a.postCount);
      var averageScores = postScores.map( user => user.average);
      var postCounts = postScores.map( user => user.postCount );
      var opComments = getOpComments();
      console.log('Note statistics below are based only on posts loaded into the DOM, so they may be incomplete');
      console.log('Total comments found:            ' + posts.length);
      console.log('Total upvoted comments found:    ' + getHighPosts().length);
      console.log('Total downvoted comments found:  ' + getLowPosts().length);
      // TODO: console.log('Total post vote volatility ' );
      console.log('Average comment score:           ' + Math.round(sum(averageScores) / sum(postCounts)));
      console.log('Max comment score:               ' + postScore(maxScorePost) + ' ' + maxScorePost.dataset.author);
      console.log('User with highest total score:   ' + postScores[0].totalScore + ' ' +  postScores[0].user);
      console.log('User with highest average score: ' + postScoresByAverage[0].average + ' ' + postScoresByAverage[0].user);
      console.log('User with lowest total score:    ' + postScores.slice(-1)[0].totalScore + ' ' + postScores.slice(-1)[0].user);
      console.log('User with lowest average score:  ' + postScoresByAverage.slice(-1)[0].average + ' ' + postScoresByAverage.slice(-1)[0].user);
      console.log('User with most posts:            ' + postScoresByCount[0].postCount + ' ' + postScoresByCount[0].user);
      if (opComments.length == 0) {
        console.log('No comments by original poster found.');
      } else {
        console.log('Comments by original poster:     ' + opComments.length + ' ' + opComments[0].dataset.author );
      };
      console.log('Total my voted comments:         ' + votedPosts().length);
      console.log('Total my upvoted comments:       ' + upvotedPosts().length);
      console.log('Total my downvoted comments:     ' + downvotedPosts().length);
    };
  } else {
    if(typeof(users) == 'string') users = [users];
    for (i = 0; i < users.length; i++) {
      if (getUserPosts(user).length == 0) {
        console.log('No comments found for user ' + users[i]);
      } else {
        var postScores = postScoresByUser(users[i]);
        console.log('Statistics on current page for user ' + users[i] + ':');
        console.log('Total number of posts:   ' + postScores[i].postCount);
        console.log('Upvoted posts:           ' + getHighPosts([users[i]]).length);
        console.log('Downvoted posts:         ' + getLowPosts([users[i]]).length);
        console.log('Total post score:        ' + postScores[i].totalScore);
        console.log('Post score average:      ' + postScores[i].average);
      };
    };
  };
  numUsers == null ? console.table(postScores.slice(0, 25)) : console.table(postScores.slick(0, numUsers));
};


function wordCounts(posts) {
  posts = checkNull(posts);
  const postTexts = posts.map( post => getPostText(post).toLowerCase() ).map( text => text.split(' ') );
  words = postTexts.flat()
  var counts = Object.create(null);
  words.forEach( function(word) {
    cleanedWord = cleanPunctuation(word);
    removeWord(cleanedWord) ? cleanedWord = '' : null;
    counts[cleanedWord] = (counts[cleanedWord] ? counts[cleanedWord] + 1 : 1);
  });
  counts = Object.entries(counts).sort( (a,b) => b[1] - a[1] );
  counts = counts.filter( word => word[0] != '' );
  return counts
};
function ngrams(posts, n) {
  posts = checkNull(posts);
  n = n || 2;
  var postTexts = posts.map( post => getPostText(post).toLowerCase() ).map( text => text.split(' ') );
  postTexts = postTexts.map( wordv => wordv.map( word => cleanPunctuation(word) ) );
  var grams = postTexts.map( wordv =>
    wordv.map( (e,i,a) => a.slice(i,i+n).length == n ? a.slice(i,i+n).join(' ') : '' )
         .filter( gram => !(/^\s*$/.test(gram)) )
  );
  return grams.flat();
};
function ngramsCounts(posts, n) {
  grams = ngrams(posts, n);
  var counts = Object.create(null);
  grams.forEach( function(gram) {
    counts[gram] = (counts[gram] ? counts[gram] + 1 : 1);
  });
  counts = Object.entries(counts).sort( (a,b) => b[1] - a[1] );
  counts = counts.filter( gram => gram[0] != '' );
  return counts
};
function cleanPunctuation(word) {
  // Remove punctuation
  punctuation = ['.', "\n", '!', '?', ',', '(', ')', '"', '/']
  if (punctuation.some( cha => word.indexOf(cha) != -1 )) {
    for (i = 0; i < punctuation.length; i++) {
      if (word.indexOf(punctuation[i]) != -1) word.replace(/punctuation[i]/g, '');
    };
  };
  return word
};
function removeWord(word) {
  // Remove unnecessary words from counts
  const wordsToRemove = ['the', 'to', 'a', 'and', 'of', 'is', 'that', 'in', 'it', 'an'];
  return wordsToRemove.indexOf(word) > -1;
};
function wordCountsGraph(wordCounts) {
  wordCounts = wordCounts.slice(0, 150);
  const maxCount = wordCounts[0][1];
  const scaleFactor = 8
  for(i = 0; i < wordCounts.length; i++) {
    var word = wordCounts[i][0];
    var count = wordCounts[i][1];
    var countLength = Math.floor( count / maxCount * getBrowserWidth() / scaleFactor );
    console.log(`%c ${Array(countLength).join('█')} ${word}`, 'color: green');
  };
};
