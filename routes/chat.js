var express = require("express");
var router = express.Router();
const messages = require("../database/inem");

let running = false;

/* GET home page. */
router.get("/get/:id", async function (req, res, next) {
	res.send(messages[req.params.id] || []);
});

module.exports = router;
