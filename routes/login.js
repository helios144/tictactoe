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
/*connection.connect(function(err) {
  if (err) throw err;
  //console.log("Connected!");
  connection.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    //console.log(result);
  });*/
//});
/* GET home page. */
router.get('/', function(req, res, next) {
		if(req.session.logscs!= ' '){
			res.render('login',{username:emptystring,error:req.session.logscs,color:"green"});
			req.session.logscs=' ';
		}
		else{
		res.render('login',{username:emptystring,error:emptystring,color:"red"});	
	}

});
//registration
router.post('/', function(req, res, next) {
	if(req.body.username!==null && req.body.username!=='' && req.body.password!==null && req.body.password!==''){
		  connection.query("SELECT user_name,ID FROM users WHERE user_name='"+req.body.username+"' and password='"+req.body.password+"'", function (err, result, fields) {
		    if(err){
		    	console.log(err);
		    	console.log("wtf error ");
		    	res.render('login',{username:emptystring,error:" error occured",color:"red"});
		    }
		    else if(result.length>0){
		    	req.session.username=result[0].user_name;
		    	//console.log(result[0].ID);
		    	req.session.userid=result[0].ID;
		    	res.redirect('/');
		    }
		    else{		    	
		  		res.render('login',{error:'Wrong Username or password',username:emptystring,color:"red"});
		    }
		    
		  });
	}
	else{
		  
		  res.render('login',{error:'Fields were left empty',username:emptystring,color:"red"});
	}
	//req.session.username=req.body.username;//req.body.username;
	//res.send(req.session.username);
  	//res.redirect('/');
});
module.exports = router;
