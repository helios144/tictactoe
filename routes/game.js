var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser=require('body-parser');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tictactoe'
});
var temp_data=[];
/* GET home page. */
router.get('/', function(req, res, next) {
	//res.send(req.session.username);
	if(req.session.username){
		res.render('game',{username:req.session.username});
	}
	else{
		res.redirect('/login');
		//var notloggedin;
		//res.render('game',{username:notloggedin});	
}
  //res.sendFile(__dirname+'/game.html');
});

router.post('/', function(req, res, next) {
		 console.log(req.session.username+" "+req.body.laikas+" "+req.body.ejimai+" "+req.body.xaro+" "+req.body.result);
		 //is asmenines lenteles is bendriem duomenim
			connection.query("SELECT * FROM personal_scores WHERE user_id="+req.session.userid, function (err, result, fields) {
			    if(err) res.redirect('/game');
			    if(result.length>0){	
			    			temp_data[0]=result[0].Wins;
			    			temp_data[1]=result[0].Loses;
			    			temp_data[2]=result[0].Draws;
			    			temp_data[3]=result[0].Wins_as_x;
			    			temp_data[4]=result[0].Loses_as_x;
			    			temp_data[5]=result[0].Draws_as_x;
			    			temp_data[6]=result[0].Wins_as_o;
			    			temp_data[7]=result[0].Loses_as_o;
			    			temp_data[8]=result[0].Draws_as_o;
			    			connection.query("SELECT * FROM overall_stats WHERE user_id="+req.session.userid, function (err, result, fields) { 		
								    	temp_data[9]=result[0].Games_played;
								    	temp_data[10]=result[0].Turns_taken;
								    	temp_data[11]=result[0].Time_spent;
								    		//duomenu atnaujinimas DB
								    		if(err) res.redirect('/game');
									    	if(req.body.xaro==1){
									    		if(req.body.result==1){//jei buvo uz X ir laimejo
									    			sql="UPDATE personal_scores SET Wins='"+(temp_data[0]+1)+"',Wins_as_x='"+(temp_data[3]+1)+"' WHERE user_id='"+req.session.userid+"'";
									    			}
									    		else if(req.body.result==0){// jei buvo uz X ir pralaimejo
									    			sql="UPDATE personal_scores SET Loses='"+(temp_data[1]+1)+"',Loses_as_x='"+(temp_data[4]+1)+"' WHERE user_id='"+req.session.userid+"'";
									    		}
									    		else{ //jei buvo uz X ir lygiosios
									    			sql="UPDATE personal_scores SET Draws='"+(temp_data[2]+1)+"',Draws_as_x='"+(temp_data[5]+1)+"' WHERE user_id='"+req.session.userid+"'";
									    		}
									    	}
									    	else{
									    		if(req.body.result==0){ //jei buvo uz O laimejo
									    			sql="UPDATE personal_scores SET Wins='"+(temp_data[0]+1)+"',Wins_as_o='"+(temp_data[6]+1)+"' WHERE user_id='"+req.session.userid+"'";
									    		}
									    		else if(req.body.result==1){ // jei buvo uz O ir pralaimejo
									    			sql="UPDATE personal_scores SET Loses='"+(temp_data[1]+1)+"',Loses_as_o='"+(temp_data[7]+1)+"' WHERE user_id='"+req.session.userid+"'";
									    		}
									    		else{ //jei buvo uz X ir lygiosios
									    			sql="UPDATE personal_scores SET Draws='"+(temp_data[2]+1)+"',Draws_as_o='"+(temp_data[8]+1)+"' WHERE user_id='"+req.session.userid+"'";
									    		
									    		}
									    	}
										connection.query(sql);
										sqll="UPDATE overall_stats SET Games_played='"+(temp_data[9]+1)+"',Turns_taken='"+(temp_data[10]+parseInt(req.body.ejimai))+"',Time_spent='"+(temp_data[11]+parseInt(req.body.laikas))+"' WHERE user_id='"+req.session.userid+"'";
										console.log("gote overal: "+temp_data[9]+" "+temp_data[10]+" "+temp_data[11]);
										connection.query(sqll);	
								 });
			    	}
		    	});		     
 });

module.exports = router;
