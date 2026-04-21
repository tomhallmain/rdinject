var express = require('express');
var router = express.Router();
var db = require('../db');

var getAllPosts = db.prepare('SELECT * FROM posts ORDER BY saved_at DESC');
var getPost = db.prepare('SELECT * FROM posts WHERE reddit_id = ?');
var insertPost = db.prepare(
  'INSERT OR IGNORE INTO posts (reddit_id, title, subreddit, url, score) VALUES (?, ?, ?, ?, ?)'
);
var deletePost = db.prepare('DELETE FROM posts WHERE reddit_id = ?');

var insertVote = db.prepare(
  'INSERT INTO votes (reddit_id, direction) VALUES (?, ?)'
);
var getVotes = db.prepare('SELECT * FROM votes WHERE reddit_id = ? ORDER BY voted_at DESC');

// GET /posts — list all saved posts
router.get('/', function(req, res) {
  var posts = getAllPosts.all();
  res.json(posts);
});

// GET /posts/:id — single post
router.get('/:id', function(req, res, next) {
  var post = getPost.get(req.params.id);
  if (!post) return next({ status: 404, message: 'Post not found' });
  res.json(post);
});

// POST /posts — save a post from the extension
router.post('/', function(req, res) {
  var { reddit_id, title, subreddit, url, score } = req.body;
  insertPost.run(reddit_id, title, subreddit, url || null, score || 0);
  res.status(201).json({ reddit_id });
});

// DELETE /posts/:id
router.delete('/:id', function(req, res) {
  deletePost.run(req.params.id);
  res.status(204).end();
});

// POST /posts/:id/vote — record a vote direction (+1 or -1)
router.post('/:id/vote', function(req, res, next) {
  var direction = parseInt(req.body.direction, 10);
  if (direction !== 1 && direction !== -1) {
    return next({ status: 400, message: 'direction must be 1 or -1' });
  }
  insertVote.run(req.params.id, direction);
  res.status(201).json({ reddit_id: req.params.id, direction });
});

// GET /posts/:id/votes — vote history for a post
router.get('/:id/votes', function(req, res) {
  var votes = getVotes.all(req.params.id);
  res.json(votes);
});

module.exports = router;
