// Reporting functions


// Statistics Methods


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
  postCountMin = postCountMin || 1;
  counts = counts.filter( user => user.postCount >= postCountMin );
  return counts.sort( (a,b) => b.postCount - a.postCount );
};
function postCountsByUser(posts, postCountMin) {
  posts = check(posts)
  var authorsByPosts = posts.map( post => post.dataset.author );
  if (postCountMin == null) postCountMin = 1;
  return getCounts(authorsByPosts, postCountMin);
};

function getPostScoresByUser(users, postCountMin) {
  // assumes unique set of users provided
  var dataByUser = new Array;
  for (var i = 0; i < users.length; i++) {
    var userPosts = getUserPosts(users[i]);
    var postScores = userPosts.map( post => postScore(post) );
    var totalScore = sum(postScores);
    var scoresCount = postScores.length;
    dataByUser.push({
      user: users[i],
      scores: postScores,
      totalScore: sum(postScores),
      postCount: scoresCount,
      average: (scoresCount == 0 ? 0 : Math.round(totalScore / scoresCount))
    });
  };
  if (postCountMin != null) dataByUser = dataByUser.filter( user => user.postCount >= postCountMin );
  return dataByUser.sort( (a,b) => b.totalScore - a.totalScore );
};
function postScoresByUser(users, postCountMin) {
  users = (typeof(users) == 'string' ? [users] : users || getUsers());
  if (postCountMin == null) userPostCount = 1;
  return getPostScoresByUser(users, postCountMin);
};


function ups(users, numUsers) { userPostStatistics(users, numUsers) };
function userPostStatistics(users, numUsers) {
  if (users == null) {
    var posts = getPosts();
    if (posts.length == 0) {
      console.log('No comments found!');
    } else {
      var maxScorePost = [...posts].sort( (a,b) => postScore(b) - postScore(a) )[0];
      var postScores = postScoresByUser(getUsers(posts));
      var postScoresByAverage = [].slice.call(postScores).sort((a,b) => b.average - a.average);
      var postScoresByCount = [].slice.call(postScores).sort((a,b) => b.postCount - a.postCount);
      var averageScores = postScores.map( user => user.average );
      var postCounts = postScores.map( user => user.postCount );
      var postLengths = postLengthsByUser(getUsers(posts));
      var averageLengths = postLengths.map( user => user.average );
      var postLengthsByAverage = [].slice.call(postLengths).sort((a,b) => b.average - a.average);
      var opComments = getOpComments();
      console.log('Note statistics below are based only on posts loaded into the DOM, so they may be incomplete');
      console.log('Total comments found:            ' + posts.length);
      console.log('Total upvoted comments found:    ' + getHighPosts().length);
      console.log('Total downvoted comments found:  ' + getLowPosts().length);
      console.log('Total removed posts found:       ' + removedPosts(posts).length);
      console.log('Total moderator posts found:     ' + modPosts(posts).length);
      console.log('Upvote to downvote ratio:        ' 
        + (getHighPosts().length / getLowPosts().length).toFixed());
      console.log('Removal ratio x 100:             ' 
        + (removedPosts(posts).length / posts.length * 100).toFixed());
      console.log('Average comment score:           ' 
        + Math.round(sum(averageScores) / sum(postCounts)));
      console.log('Max comment score:               ' 
        + postScore(maxScorePost) + ' ' + maxScorePost.dataset.author);
      console.log('User with highest total score:   ' 
        + postScores[0].totalScore + ' ' + postScores[0].user);
      console.log('User with highest average score: ' 
        + postScoresByAverage[0].average + ' ' + postScoresByAverage[0].user);
      console.log('User with lowest total score:    ' 
        + getLast(postScores).totalScore + ' ' + getLast(postScores).user);
      console.log('User with lowest average score:  ' 
        + getLast(postScoresByAverage).average + ' ' + getLast(postScoresByAverage).user);
      console.log('User with most posts:            ' 
        + postScoresByCount[0].postCount + ' ' + postScoresByCount[0].user);
      console.log('Average comment length           ' 
        + Math.round(sum(averageLengths) / sum(postCounts)));
      console.log('User with most text written:     ' 
        + postLengths[0].totalLengths + ' ' + postLengths[0].user);
      console.log('User with longest average text:  ' 
        + postLengthsByAverage[0].average + ' ' + postLengthsByAverage[0].user);
      if (opComments.length == 0) {
        console.log('No comments by original poster found.');
      } else {
        console.log('Comments by original poster:     ' 
          + opComments.length + ' ' + opComments[0].dataset.author);
      };
      console.log('Total my voted comments:         ' + votedPosts().length);
      console.log('Total my upvoted comments:       ' + upvotedPosts().length);
      console.log('Total my downvoted comments:     ' + downvotedPosts().length)
    };
  } else {
    if(typeof(users) == 'string') users = [users];
    for (i = 0; i < users.length; i++) {
      var posts = getUserPosts(users[i]);
      if (posts.length == 0) {
        console.log('No comments found for user ' + users[i]);
      } else {
        var postScores = postScoresByUser(users[i]);
        console.log('Statistics on current page for user ' + users[i] + ':');
        console.log('Total number of posts:   ' + postScores.postCount);
        console.log('Upvoted posts:           ' + getHighPosts([users[i]]).length);
        console.log('Downvoted posts:         ' + getLowPosts([users[i]]).length);
        console.log('Total post score:        ' + postScores.totalScore);
        console.log('Post score average:      ' + postScores.average);
        console.log('Removed posts:           ' + removedPosts(posts).length);
      };
    };
  };
  console.table(postScores.slice(0, numUsers || 25));
};


function postLengthsByUser(users) {
  users = (typeof(users) == 'string' ? [users] : users || getUsers());
  // assumes unique set of users provided
  var dataByUser = new Array;
  for (var i = 0; i < users.length; i++) {
    var userPosts = getUserPosts(users[i]);
    var postLengths = userPosts.map( post => postLength(post) );
    var totalLengths = sum(postLengths);
    var lengthsCount = postLengths.length;
    dataByUser.push({
      user: users[i],
      lengths: postLengths,
      totalLengths: totalLengths,
      postCount: lengthsCount,
      average: (lengthsCount == 0 ? 0 : Math.round(totalLengths / lengthsCount))
    });
  };
  return dataByUser.sort( (a,b) => b.totalLengths - a.totalLengths );
};


// Text Processing Methods


function wordCounts(posts) {
  posts = check(posts);
  const bags = posts.map( post => bagOfWords(post) );
  words = bags.flat()
  words = words.filter( word => word.length > 1 && !stopword(word) );
  var counts = Object.create(null);
  words.forEach( word => counts[word] = (counts[word] ? counts[word] + 1 : 1) );
  counts = Object.entries(counts).sort( (a,b) => b[1] - a[1] );
  counts = counts.filter( word => word[0] != '' );
  return counts
};
function ngrams(posts, n) {
  posts = check(posts);
  n = n || 2;
  var wordvs = posts.map( post => bagOfWords(post) );
  var grams = wordvs.map( wordv =>
    wordv.map( (e,i,a) => 
           a.slice(i,i+n).length == n ? a.slice(i,i+n).join(' ') : '' )
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
function bagOfWords(post) {
  const wordv = getPostText(post)?.toLowerCase().split(' ');
  return wordv.map( word => cleanPunctuation(word) );
};
function cleanPunctuation(word) {
  // Remove punctuation
  const punctuation = ['.', "\n", '!', '?', ',', '(', ')', '"', '/']
  if (punctuation.some( cha => word.indexOf(cha) != -1 )) {
    for (i = 0; i < punctuation.length; i++) {
      if (word.indexOf(punctuation[i]) != -1) word.replace(/\punctuation[i]/g, '');
    };
  };
  return word
};
function stopword(word) {
  // Remove unnecessary words from counts
  const stopwords = ['me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
    'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what',
    'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'an', 'the',
    'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
    'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
    'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 'can', 'will', 'just', 'don', 'could', 'should', 'would', 'now', 'll',
    're', 've', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'mustn', 'needn',
    'shouldn', 'wasn', 'weren', 'won', 'wouldn']
  return stopwords.indexOf(word) > -1;
};
function wordCountsGraph(wordCounts) {
  wordCounts = wordCounts.slice(0, 150);
  const maxCount = wordCounts[0][1];
  const scaleFactor = 8
  for(i = 0; i < wordCounts.length; i++) {
    var word = wordCounts[i][0];
    var count = wordCounts[i][1];
    var countLength = Math.floor(count/maxCount * getBrowserWidth()/scaleFactor);
    console.log(`%c ${Array(countLength).join('█')} ${word}`, 'color: green');
  };
};
function wcg(wordCounts) { wordCountsGraph(wordCounts) };



