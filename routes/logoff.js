var express = require('express');
var router = express.Router();
var session=require('express-session');
/* GET home page. */
router.get('/', function(req, res, next) {
	req.session.destroy();
	res.redirect('/login');
 // res.sendFile(__dirname+'/index.html');
});
module.exports = router;
