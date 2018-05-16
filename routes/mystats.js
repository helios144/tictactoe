var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mystats=[12];
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tictactoe'
});
/* GET home page. */
router.get('/', function(req, res, next) {
		if(req.session.username){
			sql="SELECT Wins,Loses,Draws,Wins_as_x,Loses_as_x,Draws_as_x,Wins_as_o,Loses_as_o,Draws_as_o,Games_played,Turns_taken,Time_spent FROM  personal_scores INNER JOIN overall_stats on personal_scores.user_id=overall_stats.user_id WHERE personal_scores.user_id="+req.session.userid;
			connection.query(sql, function (err, result, fields) {
	  			if(err){
	  				res.redirect('/');
	  			}
	  			else{
	  			//console.log(result[0].Turns_taken/result[0].Games_played+" "+result[0].Time_spent);
	  			result[0].Turns_taken=result[0].Turns_taken/result[0].Games_played;
	  			result[0].Time_spent=result[0].Time_spent/result[0].Games_played;
	  			//console.log(result[0].Turns_taken+" "+result[0].Time_spent);
	  			res.render('mystats',{username:req.session.username,mystats:result[0]});
	  			}
  			});
		
	}
	else{
		res.redirect('/login');
		//var notloggedin;
		//res.render('mystats',{username:notloggedin});	
}
});

module.exports = router;
