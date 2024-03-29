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
    }
    prev = userPosts[i];
  }
  postCountMin = postCountMin || 1;
  counts = counts.filter( user => user.postCount >= postCountMin );
  return counts.sort( (a,b) => b.postCount - a.postCount );
}
function postCountsByUser(posts, postCountMin) {
  posts = check(posts)
  var authorsByPosts = posts.map( post => post.dataset.author ).filter( user => user );
  if (postCountMin == null) postCountMin = 1;
  return getCounts(authorsByPosts, postCountMin);
}

function getPostScoresByUser(users, postCountMin) {
  // assumes unique set of users provided
  var dataByUser = new Array;
  for (var user of users) {
    var userPosts = getUserPosts(user);
    var postScores = userPosts.map( post => postScore(post) );
    var totalScore = sum(postScores);
    var scoresCount = postScores.length;
    dataByUser.push({
      user: user,
      scores: postScores,
      totalScore: sum(postScores),
      postCount: scoresCount,
      average: (scoresCount == 0 ? 0 : Math.round(totalScore / scoresCount))
    });
  }
  if (postCountMin != null) dataByUser = dataByUser.filter( user => user.postCount >= postCountMin );
  return dataByUser.sort( (a,b) => b.totalScore - a.totalScore );
}
function postScoresByUser(users, postCountMin) {
  users = (typeof(users) == 'string' ? [users] : users || getUsers());
  if (postCountMin == null) userPostCount = 1;
  return getPostScoresByUser(users, postCountMin);
}


function ups(users, numUsers) { userPostStatistics(users, numUsers) }
function userPostStatistics(users, numUsers) {
  if (users == null) {
    var posts = getPosts();
    if (posts.length > 0) {
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
      }
      console.log('Total my voted comments:         ' + votedPosts().length);
      console.log('Total my upvoted comments:       ' + upvotedPosts().length);
      console.log('Total my downvoted comments:     ' + downvotedPosts().length)
    }
  } else {
    if (typeof(users) == 'string') users = [users];
    for (var user of users) {
      var posts = getUserPosts(user);
      if (posts.length == 0) {
        console.log('No comments found for user ' + user);
      } else {
        var userPostScores = postScoresByUser(user)[0];
        var postScores = postScores || [];
        postScores.concat(userPostScores);
        console.log('Statistics on current page for user ' + user + ':');
        console.log('Total number of posts:   ' + userPostScores.postCount);
        console.log('Upvoted posts:           ' + getHighPosts(posts).length);
        console.log('Downvoted posts:         ' + getLowPosts(posts).length);
        console.log('Total post score:        ' + userPostScores.totalScore);
        console.log('Post score average:      ' + userPostScores.average);
        console.log('Removed posts:           ' + removedPosts(posts).length);
      }
    }
  }
  if (!empty(postScores)) console.table(postScores.slice(0, numUsers || 25));
}


function postLengthsByUser(users) {
  users = (typeof(users) == 'string' ? [users] : users || getUsers());
  // assumes unique set of users provided
  var dataByUser = new Array;
  for (var user of users) {
    var userPosts = getUserPosts(user);
    var postLengths = userPosts.map( post => postLength(post) );
    var totalLengths = sum(postLengths);
    var lengthsCount = postLengths.length;
    dataByUser.push({
      user: user,
      lengths: postLengths,
      totalLengths: totalLengths,
      postCount: lengthsCount,
      average: (lengthsCount == 0 ? 0 : Math.round(totalLengths / lengthsCount))
    });
  }
  return dataByUser.sort( (a,b) => b.totalLengths - a.totalLengths );
}


// Text Processing Methods


function wordCounts(posts) {
  const words = getAllWords(posts);
  var counts = {}
  words.forEach( word => counts[word] = (counts[word] ? counts[word] + 1 : 1) );
  return counts
}
function countsArray(countsObj) {
  var counts = Object.entries(countsObj).sort( (a,b) => b[1] - a[1] );
  return counts = counts.filter( word => word[0] != '' );
}
function wordCountsByUser(posts) {
  posts = check(posts);
  const users = getUsers(posts);
  var userWordCounts = {}
  users.forEach( user => {
    userWordCounts[user] = wordCounts(getUserPosts(user));
  });
  return userWordCounts
}
function wordUniquenessByUser(posts, minUserWords) {
  posts = check(posts);
  const allWords = wordCounts(posts);
  const userCounts = wordCountsByUser(posts);
  const users = Object.keys(userCounts);
  var userScores = [];
  const allWordsCount = sum(Object.values(allWords));
  users.forEach( user => {
    var userWords = userCounts[user];
    var wordScores = [];
    var numUserWords = Object.keys(userWords).length;
    var userCountTotal = sum(Object.values(userWords));
    if (!minUserWords || numUserWords >= minUserWords) { 
      Object.entries(userWords).forEach( entry => {
        var word = entry[0];
        var userCount = entry[1];
        var inverseCount = allWords[word] - userCount + 1;
        var wordVal = userCount * (allWordsCount - userCountTotal) / inverseCount;
        wordScores.push(Math.log(wordVal));
      });
    }
    var userScore = sum(wordScores) / numUserWords * Math.tanh(numUserWords);
    userScores.push([user, userScore]);
  });
  userScores = userScores.sort( (a,b) => b[1] - a[1] );
  return userScores;
}
function uniqueUserWords(posts, minUserWords) {
  const allWordCounts = wordCounts(posts);
  const allWords = Object.keys(allWordCounts);
  const userCounts = wordCountsByUser(posts);
  const users = Object.keys(userCounts);
  var uniqueWords = {}
  users.forEach( user => {
    var userWords = userCounts[user];
    var userCountTotal = sum(Object.values(userWords));
    if (!minUserWords || numUserWords >= minUserWords) {
      Object.entries(userWords).forEach( entry => {
        var word = entry[0];
        var userCount = entry[1];
        var allCount = allWordCounts[word];
        var wordUnique = userCount / allCount > 0.95
        if (wordUnique) {
          uniqueWords[user] ? uniqueWords[user].push(word) : uniqueWords[user] = [word];
        }
      });
    }
  })
  return uniqueWords;
}
function uniqueUsers(posts) {
  userWords = uniqueUserWords(posts);
  users = Object.keys(userWords);
  users.forEach( user => {
    if (userWords[user].length < 3) { delete userWords[user] }
  });
  return Object.keys(userWords)
}
function nonuniqueUsers(posts) {
  const users = getUsers(posts);
  const unique = uniqueUsers(posts);
  return users.filter( user => unique.indexOf(user) === -1 );
}
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
}
function ngramsCounts(posts, n) {
  grams = ngrams(posts, n);
  var counts = {}
  grams.forEach( function(gram) {
    counts[gram] = (counts[gram] ? counts[gram] + 1 : 1);
  });
  counts = Object.entries(counts).sort( (a,b) => b[1] - a[1] );
  counts = counts.filter( gram => gram[0] != '' );
  return counts
}
function bagOfWords(post) {
  return getPostText(post)?.toLowerCase()
    .split(/\W+/)
    .filter( word => word.length > 1 && !stopword(word) );
}
function getAllWords(posts) {
  return check(posts).map( post => bagOfWords(post) ).flat();
}
const stopwords = [
  'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
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
  'shouldn', 'wasn', 'weren', 'won', 'wouldn', 'https', 'www'
]
function stopword(word) {
  // Remove unnecessary words from counts
  return stopwords.indexOf(word) > -1;
}
function wordCountsGraph(wordCounts) {
  wordCounts = wordCounts || countsArray(wordCounts())
  wordCounts = wordCounts.slice(0, 150);
  const maxCount = wordCounts[0][1];
  const scaleFactor = 8
  wordCounts.forEach( wc => {
    var word = wc[0];
    var count = wc[1];
    var countLength = Math.floor(count/maxCount * getBrowserWidth()/scaleFactor);
    console.log(`%c ${Array(countLength).join('█')} ${word}`, 'color: green');
  });
}
function wcg(posts) { wordCountsGraph(countsArray(wordCounts(posts))) }
function ngr(posts) { wordCountsGraph(ngramsCounts(posts)) }

if (!n_scripts) var n_scripts = 0;
n_scripts++

