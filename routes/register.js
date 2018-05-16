var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var session=require('express-session');
var mysql = require('mysql');
var emptystring;
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tictactoe'
});
connection.connect(function(err) {
  if (err) throw err;
  //console.log("Connected!");
  connection.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    //console.log(result);
  });
});
/* GET home page. */
router.get('/', function(req, res, next) {
		req.session.logscs=' ';
		res.render('register',{username:emptystring,error:emptystring});	

});
//registration
router.post('/', function(req, res, next) {
	if(req.body.username!==null && req.body.username!=='' && req.body.password!==null && req.body.password!==''&& req.body.passwordagain!==null && req.body.passwordagain!==''){
		if(req.body.password==req.body.passwordagain){
		  connection.query("SELECT user_name FROM users WHERE user_name='"+req.body.username+"'", function (err, result, fields) {
		    if(err){
		    	console.log(err);
		    	console.log("wtf error ");
		    	res.render('register',{username:emptystring,error:" error occured"});
		    }
		    else if(result.length>0){	console.log("l>0 ");	    	
		  		res.render('register',{username:emptystring,error:'User name already in use'});
		    }
		    else{
		    	console.log(req.body.username+" "+req.body.password);
		    	console.log("ok ");
		    	var sql="INSERT INTO users (user_name,password) VALUES ('"+req.body.username+"','"+req.body.password+"')";
		    	connection.query(sql, function (err, result) {
				    if (err) throw err;
				    console.log("user "+req.body.username+" created");
				    var sql="SELECT ID from users WHERE user_name='"+req.body.username+"'";
				    connection.query(sql, function (err2, result2) {
				    	if (err2) throw err2;
				    	console.log(result2[0].ID);
				    	var sql="INSERT INTO `overall_stats` (`user_id`) VALUES ('"+result2[0].ID+"')";
				    	connection.query(sql);
				    	var sql="INSERT INTO `personal_scores` (`user_id`) VALUES ('"+result2[0].ID+"')";
				    	connection.query(sql);
				    });
				    
				  });
		    	req.session.logscs="Registration succesfull!";
		    	res.redirect('/login');
		    } 
		 });
		}
		  else{	  		
		  		res.render('register',{username:emptystring,error:'Password did not match'});
		  }
	}
	else{
		
		res.render('login',{error:emptystring,username:emptystring,regerror:'Fields were left empty'});
	}
});
module.exports = router;
