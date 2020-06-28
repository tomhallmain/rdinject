
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
}
function down(posts, overwriteVotes) {
  posts = posts || (overwriteVotes ? getPosts() : unvotedPosts());
  randomVoting( posts, 0.0001, true, 0.7)
}
function normalizeScores() {
  var highPosts = getHighPosts();
  var lowPosts = getLowPosts();
  upvotePosts(lowPosts);
  downvotePosts(highPosts);
  console.log('Tried upvoting ' + lowPosts.length + ' low score posts found');
  console.log('Tried downvoting ' + highPosts.length + ' high score posts found');
};
function echoChamber(voteChance) {
  voteChance = voteChance || 0.7
  var highPosts = getHighPosts().filter( () => Math.random() < (voteChance));
  var lowPosts = getLowPosts().filter( () => Math.random() < (voteChance));
  upvotePosts(highPosts);
  downvotePosts(lowPosts);
  console.log('Tried upvoting ' + highPosts.length + ' high score posts');
  console.log('Tried downvoting ' + lowPosts.length + ' low score posts');
  console.log('Thanks for keeping the echo going!');
};
function randomVoting(posts, upvoteChance, includeDownvotes, downvoteChance) {
  posts = check(posts);
  var upPosts = posts.filter( () => Math.random() < (upvoteChance || 0.5) );
  if (!empty(upPosts)) { upvotePosts(upPosts) };
  if (includeDownvotes) {
    var downPosts = posts.filter( post => upPosts.indexOf(post) == -1 )
    if (downvoteChance) { 
      downPosts = downPosts.filter( () => Math.random() < (downvoteChance || 0.5) )
    };
    if (!empty(downPosts)) { downvotePosts(downPosts) };
  };
  console.log('Randomly voted on ' + posts.length + ' posts if votable');
};
function randomDropVoting(posts, dropChance, upvoteChance) {
  posts = check(posts);
  var dropPosts = posts.filter( () => Math.random() < (dropChance || 0.7) );
  votePosts = posts.filter( post => dropPosts.indexOf(post) == -1 );
  var upPosts = votePosts.filter( () => Math.random() < (upvoteChance || 0.7) );
  var downPosts = votePosts.filter( post => upPosts.indexOf(post) == -1 );
  upvotePosts(upPosts);
  downvotePosts(downPosts);
  console.log('Randomly voted on ' + votePosts.length 
    + ' posts out of ' + posts.length + ' posts found.');
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

function prevPage() {
  // Jumps to previous page of user comments
  (document.querySelector('.prev-button')?.getElementsByTagName('a')[0].click() ||
    console.log('Previous page button not found'));
};
function nextPage() {
  // Jumps to next page of user comments
  (document.querySelector('.next-button')?.getElementsByTagName('a')[0].click() ||
    console.log('Next page button not found'));
};


