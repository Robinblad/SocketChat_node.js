var express = require('express');
var router = express.Router();

let users = [];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(users);
});

/* GET users listing. */
router.post('/create', function(req, res, next) {
  users.push(req.body);
  res.send('you are new user');
});

module.exports = router;
