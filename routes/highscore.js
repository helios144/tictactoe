var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var highscores={};
var overall=[];
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tictactoe'
});
/* GET home page. */
router.get('/', function(req, res, next) {
  	if(req.session.username){
  		sql="SELECT user_name,Wins,Loses,Draws FROM personal_scores INNER JOIN users on personal_scores.user_id=users.ID order by Wins desc limit 10";
  		connection.query(sql, function (err, result, fields) {
  			if(err){
  				res.redirect('/');
  			}
  			else{
  				for(var i=1;i<=result.length;i++){
  					highscores[i]={};	
  					highscores[i].user_names=result[i-1].user_name;
  					highscores[i].Wins=result[i-1].Wins;
  					highscores[i].Draws=result[i-1].Draws;
  					highscores[i].Loses=result[i-1].Loses;
  				}
  				sql="SELECT Games_played,Turns_taken,Time_spent FROM overall_stats";
  						overall[0]=0;
  						overall[1]=0;
  						overall[2]=0;
  				connection.query(sql, function (err, result, fields) {
  					if(err){
  						res.redirect('/');
  					}
  					else{
  						overall[0]=0;
  						overall[1]=0;
  						overall[2]=0;
	  				if(result.length>0){
	  					for(var i=0;i<result.length;i++){
	  						overall[0]+=result[i].Games_played;
	  						overall[1]+=result[i].Turns_taken;
	  						overall[2]+=result[i].Time_spent;
	  					}
	  				}
  				}
  				//console.log(overall[0]+" "+overall[1]+" "+overall[2]);
  				res.render('highscore',{username:req.session.username,highscoress:highscores,overall:overall});
  				});
  				
  			}
  		});
		//res.render('highscore',{username:req.session.username});
	}
	else{
		res.redirect('/login');
		//var notloggedin;
		//res.render('highscore',{username:notloggedin});	
}
});

module.exports = router;
