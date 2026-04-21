var express = require('express');
var router = express.Router();
var db = require('../db');

var countPosts = db.prepare('SELECT COUNT(*) AS total FROM posts');

router.get('/', function(req, res) {
  var { total } = countPosts.get();
  res.render('index', { title: 'rddb', postCount: total });
});

module.exports = router;
