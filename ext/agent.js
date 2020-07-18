
// Interaction Methods

function votablePosts(posts) {
  posts = check(posts);
  const today = new Date();
  const compareDate = today.setDate(today.getDate() - 180);
  return nonremovedPosts(posts.filter(post => postTime(post) > compareDate && !modPost(post)));
};
function unvotedPosts(posts) {
  posts = check(posts);
  return posts.filter(post => post.querySelector('.entry.unvoted')?.parentElement == post );
};
function votedPosts(posts) {
  posts = check(posts);
  return posts.filter(post => post.querySelector('.entry.unvoted')?.parentElement != post );
};
function upvotedPosts(posts) {
  posts = check(posts);
  return posts.filter(post => post.querySelector('.entry.likes')?.parentElement == post );
};
function downvotedPosts(posts) {
  posts = check(posts);
  return posts.filter(post => post.querySelector('.entry.dislikes')?.parentElement == post );
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
  votable_posts = votablePosts(posts);
  var unvotable = posts.length - votable_posts.length;
  voteAll(getPostUpvotes(votable_posts));
  console.log('Upvoted ' + votable_posts.length + ' posts');
  if (unvotable > 0) {
    console.log(unvotable + ' posts given were unvotable.');
  };
};
function downvotePosts(posts) {
  if (posts.length == 0) {
    console.log('No posts found to downvote!');
    return;
  };
  votable_posts = votablePosts(posts);
  var unvotable = posts.length - votable_posts.length;
  voteAll(getPostDownvotes(votable_posts));
  console.log('Downvoted ' + votable_posts.length + ' posts');
  if (unvotable > 0) {
    console.log(unvotable + ' posts given were unvotable.');
  };
};
function upvoteUserPosts(username) {
  var posts = getUserPosts(username);
  if (posts.length == 0) {
    console.error('No posts found for user ' + username);
    return;
  };
  upvotePosts(posts);
  console.log('Tried upvoting ' + posts.length + ' posts found for user');
};
function downvoteUserPosts(username) {
  var posts = getUserPosts(username);
  if (posts.length == 0) {
    console.error('No posts found for user ' + username);
    return;
  };
  downvotePosts(posts);
  console.log('Tried downvoting ' + posts.length + ' posts found for user');
};

function up(posts, overwriteVotes) {
  posts = posts || (overwriteVotes ? getPosts() : unvotedPosts());
  randomVoting( posts, 0.7 );
};
function down(posts, overwriteVotes) {
  posts = posts || (overwriteVotes ? getPosts() : unvotedPosts());
  randomVoting( posts, 0.0001, true, 0.7 );
};
function getHighLowPosts(posts, voteChance) {
  posts = check(posts);
  voteChance = voteChance || 0.7
  highPosts = getHighPosts(posts);
  lowPosts = getLowPosts(posts);
  return {
    highTotal: highPosts.length,
    lowTotal: lowPosts.length,
    voteHigh: chanceFilter(highPosts, voteChance),
    voteLow: chanceFilter(lowPosts, voteChance)
  };
};
function normalizeScores(posts, voteChance) {
  const {highTotal, lowTotal, voteHigh, voteLow} = getHighLowPosts(posts, voteChance);
  upvotePosts(voteLow);
  downvotePosts(voteHigh);
  console.log('Tried upvoting ' + voteLow.length + ' low score posts ' +
    'out of ' + lowTotal.length + ' total found');
  console.log('Tried downvoting ' + voteHigh.length + ' high score posts ' + 
    'out of ' + highTotal.length + ' total found');
  console.log('Less craziness is usually good.');
};
function echoChamber(posts, voteChance) {
  const {highTotal, lowTotal, voteHigh, voteLow} = getHighLowPosts(posts, voteChance);
  upvotePosts(voteHigh);
  downvotePosts(voteLow);
  console.log('Tried upvoting ' + voteHigh.length + ' high score posts ' +
    'out of ' + highTotal + ' total found');
  console.log('Tried downvoting ' + voteLow.length + ' low score posts ' +
    'out of ' + lowTotal + ' total found');
  console.log('Thanks for keeping the echo going!');
};
function randomVoting(posts, upvoteChance, includeDownvotes, downvoteChance) {
  posts = check(posts);
  var upPosts = chanceFilter(posts, (upvoteChance || 0.5));
  if (!empty(upPosts)) { upvotePosts(upPosts) };
  if (includeDownvotes) {
    var downPosts = posts.filter( post => upPosts.indexOf(post) == -1 )
    if (downvoteChance) { 
      downPosts = chanceFilter(downPosts, (downvoteChance || 0.5));
    };
    if (!empty(downPosts)) { downvotePosts(downPosts) };
  };
  console.log('Randomly voted on ' + posts.length + ' posts if votable');
};
function randomDropVoting(posts, dropChance, upvoteChance) {
  posts = check(posts);
  var dropPosts = chanceFilter(posts, (dropChance || 0.7));
  votePosts = posts.filter( post => dropPosts.indexOf(post) == -1 );
  var upPosts = chanceFilter(votePosts, (upvoteChance || 0.7));
  var downPosts = votePosts.filter( post => upPosts.indexOf(post) == -1 );
  upvotePosts(upPosts);
  downvotePosts(downPosts);
  console.log('Randomly voted on ' + votePosts.length +
    ' posts out of ' + posts.length + ' posts found.');
};
function assistControversial(posts) {
  posts = check(posts);
  var users = getControversialUsers(posts);
  upvotePosts(getUserPosts(users));
  console.log('Upvoted votable posts for users: ' + users.join(', '));
};
function hinderProfane(posts) {
  posts = check(posts);
  downvotePosts(getProfanePosts(posts));
};
function assistLowScore(posts, users, postCountMin) {
  posts = check(posts);
  var lowUsers = postScoresByUser(users, postCountMin).filter( user =>
    user.scores.some( score => score < 1 )
    ).map( user => user.user );
  upvotePosts(getUserPosts(lowUsers));
  console.log('Upvoted votable posts for users: ' + lowUsers.join(', '));
};
function praiseUnique(posts, numUsers) {
  numUsers = numUsers || 10;
  const uniqUsers = wordUniquenessByUser(posts, 15).slice(0,numUsers)
    .map( user => user[0] );
  up(getUserPosts(uniqUsers));
};
function userComplement(user, direction) {
  // Add method to vote on the posts of other users related to the posts of a
  // specific user
};


function prevPage() {
  // Jumps to previous page of posts
  const button = document.querySelector('.prev-button')?.getElementsByTagName('a')[0]
  button ? button.click() : console.log('Previous page button not found');
};
function nextPage() {
  // Jumps to next page of posts
  button = document.querySelector('.next-button')?.getElementsByTagName('a')[0]
  button ? button.click() : console.log('Next page button not found');
};


