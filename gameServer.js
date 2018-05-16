var express = require("express");
var path =require('path');
var favicon = require('serve-favicon');
var app     = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var nsp=io.of('/game');
var session=require('express-session');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var mysql = require('mysql');
var ejs=require('ejs');
//game  variables
var game_base_values={
  kas_eina: "X",//nurodo kieno dar ejimas
  xo0:2,  xo1:2,  xo2:2,  xo3:2,  xo4:2,  xo5:2,  xo6:2,  xo7:2,  xo8:2,
  turn_text_color:126,//ejima rodancio teksto pradine spalva
  end_card_text_size:0,//pabaigos teksto dydzio kitima nurodantis kintamasis
  which_player:1,//stebi kurio zaidejo dabar ejimas
  turn_count:0,//skaiciuoja ejimu skaiciu
  end_rezult:9,// nurodo kas laimejo zaidima
  thetimeleft:45,
};
var x_or_0={};
var socket_room={};
var is_in_game={};
var rematch={}; 
var room_count=1;
var gametime={};
var users={};
var guest=0;
//game variables end
var index = require('./routes/index');
var game = require('./routes/game');
var login = require('./routes/login');
var logoff = require('./routes/logoff');
var register = require('./routes/register');
var highscore = require('./routes/highscore');
var mystats = require('./routes/mystats');
//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
// view engine end

// register the bodyParser middleware for processing forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// register body parser middleware end
//session
app.use(cookieParser());
app.use(session({secret:"tictactoesession",resave:false,saveUninitialized:false,cookie: { maxAge: 18000000 }}));
//server stativ files
app.use(express.static(__dirname+'/public'));
//serve favicon
app.use(favicon(__dirname + '/public/favicon.ico'));
//routes
app.use('/', index); // mount the index route at the / path
app.use('/game', game);
app.use('/login', login);
app.use('/highscore', highscore);
app.use('/mystats', mystats);
app.use('/logoff', logoff);
app.use('/register',register);
app.use(function(req, res, next){
    res.status(404).render('404-not-found',{username:req.session.username});
});
//lets all files use session
app.use(function(req,res){
  res.locals.session=req.session;
});

//io.use(session);
//sockets
nsp.on('connection', function(socket){ 
  console.log("a user connected");
  is_in_game[socket.id]=0; 
  socket.join("lobby");
  socket.emit("username");
  socket.on("username",function(data){
  //get username and set user data in lobby
  users[socket.id]={username:data.user,socket:socket.id,status:"Online"};
  nsp.in("lobby").emit('lobby',{users});
  });
  socket.on('turn',function(data){
      socket.broadcast.to(socket_room[socket.id]).emit('turn',data);
  });
  setInterval(function(){nsp.emit('lobby',{users})},30000)
  /*socket.on('join',function(data){  
     // var room=io.sockets.adapter.rooms; 
      //console.log(room['adapter']);
      //socket.join('room'+room_count);
       var room=nsp.clients();
     //console.log(room.adapter.rooms['room'+room_count]);
      if(room.adapter.rooms['room'+room_count]===undefined){
        socket.join('room'+room_count);
        //console.log(room.adapter.rooms['room'+room_count]);
        socket_room[socket.id]='room'+room_count;
        rematch[socket_room[socket.id] ]={};
        rematch[socket_room[socket.id]][0]="none";
        rematch[socket_room[socket.id]][1]=0;
        //console.log(socket_room[socket.id]+" "+socket.id+" undefined");
       // console.log("user joined "+socket_room[socket.id]+" undefined");
        x_or_0[socket_room[socket.id]]=Math.round(Math.random());
        socket.emit('connectt',game_base_values);
        socket.emit('xoro',x_or_0[socket_room[socket.id]]); 
      }
      else{
        socket.join('room'+room_count);
        socket_room[socket.id]='room'+room_count;
      if(x_or_0[socket_room[socket.id]]==1){
             x_or_0[socket_room[socket.id]]=0;
             socket.emit('connectt',game_base_values);
             socket.emit('xoro',x_or_0[socket_room[socket.id]]);

        }
        else{
             x_or_0[socket_room[socket.id]]=1;
             socket.emit('connectt',game_base_values);
             socket.emit('xoro',x_or_0[socket_room[socket.id]]);
        }
      gametime[socket.id]=setInterval(function(){nsp.in(socket_room[socket.id]).emit('time')},1000/100);
     // console.log("user joined "+socket_room[socket.id]);
      //console.log(" lets play room"+room_count);
      nsp.in(socket_room[socket.id]).emit('begin');
      room_count++;
  }
  });*/
    socket.on('endgame',function(data){
      x_or_0[socket_room[socket.id]]=3;
      clearInterval(gametime[socket.id]);
      /*if (typeof users[socket.id]['status'] !== 'undefined'){
     users[socket.id]['status']="Online";
      nsp.in("lobby").emit('lobby',{users});
    }*/
    });
    /*socket.on('connectt',function(data){
      io.in(socket_room[socket.id]).emit('connectt',game_base_values);
    });*/
    socket.on('rematch',function(data){
      //console.log("remach "+socket_room[socket.id]+" "+socket.id);
        if(socket.id!=rematch[socket_room[socket.id]][0]){
        rematch[socket_room[socket.id]][1]++;
        rematch[socket_room[socket.id]][0]=socket.id;
      }
        if(rematch[socket_room[socket.id]][1]==2){
         //console.log("is naujo");
         if(x_or_0[socket_room[socket.id]]==3){
         x_or_0[socket_room[socket.id]]=Math.round(Math.random());
         socket.emit('xoro',x_or_0[socket_room[socket.id]]);
        }
         if(x_or_0[socket_room[socket.id]]==1){
             x_or_0[socket_room[socket.id]]=0;
             socket.broadcast.to(socket_room[socket.id]).emit('xoro',x_or_0[socket_room[socket.id]]);
        }
        else{
             x_or_0[socket_room[socket.id]]=1;
             socket.broadcast.to(socket_room[socket.id]).emit('xoro',x_or_0[socket_room[socket.id]]);
        }
        if (typeof users[socket.id]['status'] !== 'undefined'){
        users[socket.id]['status']="Ingame";
        nsp.in("lobby").emit('lobby',{users});
      }
         nsp.in(socket_room[socket.id]).emit('rematch',game_base_values);
         gametime[socket_room[socket.id]]=setInterval(function(){io.in(socket_room[socket.id]).emit('time')},1000/100);
         rematch[socket_room[socket.id]][1]=0;
         rematch[socket_room[socket.id]][0]="none";
       }
    });
    //paspaudus nors vienam exit mygtuka
    socket.on('exit', function(data){
      socket.leave(socket_room[socket.id]); 
      socket.broadcast.to(socket_room[socket.id]).emit('second_exit');       
      clearInterval(gametime[socket_room[socket.id]]); 
      if (typeof users[socket.id]['status'] !== 'undefined'){
      users[socket.id]['status']="Online";
      is_in_game[socket.id]=0;
      nsp.in("lobby").emit('lobby',{users});
    }

  });
    //isregstruoja antra zaideja is kambario
    socket.on('second_exit', function(data){
      socket.leave(socket_room[socket.id]);
      clearInterval(gametime[socket.id]);
      if (typeof users[socket.id]['status'] !== 'undefined'){
      users[socket.id]['status']="Online";
      is_in_game[socket.id]=0;
      nsp.in("lobby").emit('lobby',{users});
    }
      delete x_or_0[socket_room[socket.id]];
      delete socket_room[socket.id];   

  });
    //invite
    /*socket.on('inviteother',function(data){
      
    });*/
      socket.on('invite',function(data){  
        var joinroom='room'+room_count;
        room_count++;
        socket.broadcast.to(data.id).emit('invitesend',{joinroom:joinroom,user:data.user,sec_id:socket.id});
  });
    socket.on('startp1',function(data){  
    if(is_in_game[socket.id]!=1){
      //console.log("p1 "+data.joinroom);
        socket.join(data.joinroom);
        is_in_game[socket.id]=1;
        socket_room[socket.id]=data.joinroom;
      if(x_or_0[socket_room[socket.id]]==1){
             x_or_0[socket_room[socket.id]]=0;
             socket.emit('connectt',game_base_values);
             socket.emit('xoro',x_or_0[socket_room[socket.id]]);
        }
        else{
             x_or_0[socket_room[socket.id]]=1;
             socket.emit('connectt',game_base_values);
             socket.emit('xoro',x_or_0[socket_room[socket.id]]);
        }
        if (typeof users[socket.id]['status'] !== 'undefined'){
      users[socket.id]['status']="Ingame";
      nsp.in("lobby").emit('lobby',{users});
    }
      gametime[socket_room[socket.id]]=setInterval(function(){nsp.in(socket_room[socket.id]).emit('time')},1000);
      //console.log("user joined "+socket_room[socket.id]);
      console.log(" lets play"+data.joinroom);
      nsp.in(socket_room[socket.id]).emit('begin');
   }
    });

socket.on('startp2',function(data){
         // var room=io.sockets.adapter.rooms; 
      //console.log(room['adapter']);
      //socket.join('room'+room_count);
      // var room=nsp.clients();
     // console.log(room.adapter.rooms);
      if(is_in_game[data.sec_id]!=1){
        socket.join(data.joinroom);
        is_in_game[socket.id]=1;
        socket_room[socket.id]=data.joinroom;
        rematch[socket_room[socket.id] ]={};
        rematch[socket_room[socket.id]][0]="none";
        rematch[socket_room[socket.id]][1]=0;
        //console.log(socket_room[socket.id]+" "+socket.id+" undefined");
        //console.log("user joined "+socket_room[socket.id]);
        x_or_0[socket_room[socket.id]]=Math.round(Math.random());
        //console.log("my id:"+socket.id+" sender id:"+data.sec_id);
        if (typeof users[socket.id]['status'] !== 'undefined'){
        users[socket.id]['status']="Ingame";
        nsp.in("lobby").emit('lobby',{users});
      }
        socket.broadcast.to(data.sec_id).emit('startp1',data);
        socket.emit('connectt',game_base_values);
        socket.emit('xoro',x_or_0[socket_room[socket.id]]);
      }
      else{
         if (typeof users[socket.id]['status'] !== 'undefined'){
          users[socket.id]['status']="Online";
          is_in_game[socket.id]=0;
          nsp.in("lobby").emit('lobby',{users});
      }
        socket.emit('declined');
       // console.log("oh well");
      }
});

    //disconnect
    socket.on('disconnect', function(){
    delete users[socket.id];
    nsp.in("lobby").emit('lobby',{users});
    clearInterval(gametime[socket.id]);
    delete x_or_0[socket_room[socket.id]];
    delete socket_room[socket.id];
    delete is_in_game[socket.id];
    console.log("a user disconnected");
  });
});
//end sockets
/*app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
  //res.status(404).render('404-not-found');
});*/
/*app.get('*', function(req, res){
  res.status(404).render('404-not-found');
});*/

server.listen(8088);
console.log("Server is running on port 9889");