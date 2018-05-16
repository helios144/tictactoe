//zaidimas
 var canvas;
 var ctx;
 var kas_eina;//="X";//nurodo kieno daar ejimas
 var kur_piesti_x_ir_o=[];//=[2,2,2,2,2,2,2,2,2];// talpina reiskmes kur lentoje ir ar x ar 0 reikia piesti
 var color_anim_var;//=0;// pagalbinis spalvos animacijos kintamasis
 var size_anim_var;//=0;// pagalbinis dydzio animacijos kintamasis
 var turn_text_color;//=126;//ejima rodancio teksto pradine spalva
 var end_card_text_size;//=0;//pabaigos teksto dydzio kitima nurodantis kintamasis
 var which_player;//=1;//stebi kurio zaidejo dabar ejimas
 var turn_count;//=0;//skaiciuoja ejimu skaiciu
 var end_rezult;//=9;// nurodo kas laimejo zaidima
 var restart_button_press_color=0;// kintamasis stebi ar nuspaustas restart mygtukas
 var exit_button_press_color=0;
 var thetimeleft;//=45;
 var theboard;
 var count_time;
 var socket=io.connect('/game');
 var iam;
 var gamestart=0;
 //statistikai
 var ejimai;
 var laikas;
//garsai
 var endsound=0;
 var mute=0;
 var btclicksound = new Audio('button_click.mp3');
 var winsound = new Audio('win.mp3');
 var drawsound = new Audio('draw.mp3');
 var loosesound = new Audio('loose.mp3');
 //--sockets
 var invdata;


 socket.on('disconnect', function(data){
  location.reload();
});
  socket.on('declined', function(data){
    document.getElementById('menu-lobby').style.display="block";
    //console.log("ohwell");
});
 //--lobby socket events
 socket.on("username",function(data){
    var user=document.getElementById("theusername").innerHTML;
    socket.emit("username",{user:user});
 });
//-invites socket events
 socket.on("invitesend",function(data){
    document.getElementById('invitetext').innerHTML=data.user+" invites you to a game";
    if(gamestart===0){
        $('#invite').modal('show');
    }
    invdata=data;
 });
 socket.on("startp1",function(data){
        socket.emit("startp1",data);
        document.getElementById('menu-lobby').style.display="none";
    });
 function accept(){
    document.getElementById('menu-lobby').style.display="none";
    socket.emit("startp2",invdata);
    
 }
//-invites socket events end

  socket.on("lobby",function(data){
    var users=data.users;
    //console.log(Object.keys(users).length);
    if(Object.keys(users).length<=1)document.getElementById("lobby").innerHTML='No users online';
    else document.getElementById("lobby").innerHTML='';
    $.each(users, function(index, value) {
        if(socket.id!=value.socket){
            document.getElementById("lobby").innerHTML+="<tr><td>"+value.username+"</td><td class='"+value.status+"'>"+value.status+"</td><td><button id='"+value.socket+"' class='glyphicon glyphicon-send snd-btn' onClick='invite(this.id);'></button></td></tr>";
        }
    });
    if(Object.keys(users).length<=1)document.getElementById("lobby").innerHTML='No users online';    
 });
 //--lobby socket events end

 //--game socket events
 socket.on('xoro',function(data){
    iam=data;
    //console.log("I am: "+iam+" players turn "+which_player);
    if(iam!=which_player){
         document.getElementById("tictactoegame").removeEventListener('mousedown',choosesquere);
    }
    else{
        document.getElementById("tictactoegame").addEventListener('mousedown',choosesquere,false);
    }
 });
         socket.on('connectt',function(data){
            getServerData(data);
            endsound=0;
    });
        socket.on('turn',function(data){
            on_off_ingame_click(data.which_player);
            getServerData(data)
            gamelogic(turn_count);
    });

        socket.on('second_exit',function(data){
                clearInterval(theboard);
            //clearInterval(count_time);
            document.getElementById("tictactoegame").style.display="none";
            document.getElementById("tictactoegame").removeEventListener('mousedown',choosesquere);
            document.getElementById("tictactoegame").removeEventListener('mousedown',pressrestartcolor);
            document.getElementById("tictactoegame").removeEventListener('mouseup',pressrestart);
            document.getElementById("tictactoegame").removeEventListener('mousedown',pressExitcolor);
            document.getElementById("tictactoegame").removeEventListener('mouseup',pressExit);
            socket.emit('second_exit');
            document.getElementById('menu-lobby').style.display="block";
      });
        socket.on('rematch',function(data){
                ejimai=0;
                laikas=0;
                getServerData(data);
                restart();
      });
         socket.on('begin',function(data){
            document.getElementById("tictactoegame").style.display="block";
                thegame();
                window.location.href = '#tictactoegame';
                gamestart=1;
      });
         socket.on('time',function(data){
                timerTime();
         });
         //--game socket events end

        //---socket

       /* function playgame(){
            socket.emit('join');
        }*/
/* window.onload=*/function thegame(){
    canvas=document.getElementById("tictactoegame");
    ctx=canvas.getContext("2d");
    var fps=30;
    ejimai=0;
    laikas=0;
    //socket.emit('connectt');
   //on_off_ingame_click(which_player);
    //count_time=setInterval(timerTime,1000/100);
    theboard=setInterval(drawBoard,1000/fps);
 }
 function drawBoard(){// piesia vasa zaidima
    var device_width=window.innerWidth;
    var device_height=window.innerHeight;
    // canvas ismatavimu suteikimas pagal lango dydi
    if(device_width>device_height){
      document.getElementById("tictactoegame").width=device_height;
      document.getElementById("tictactoegame").height=device_height;
      document.getElementById("tictactoegame").style.marginLeft=((device_width-device_height)/2)+"px";
    }
    else{
    document.getElementById("tictactoegame").width=device_width;
    document.getElementById("tictactoegame").height=device_width;
    document.getElementById("tictactoegame").style.marginLeft="0px";
    }
    //loginpos();
    //--------------------------------------------------
    var board_left=canvas.width-(canvas.width*9.5/10);
    var board_top=canvas.width-(canvas.width*9.25/10);
    var board_size=canvas.width*9/10;
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    title();
    kieno_ejimas(color_animation());
    ctx.fillStyle="#464646";
    ctx.fillRect(board_left,board_top,board_size,board_size);//zaidimo laukas
    strline(board_left+board_size/3,board_top,board_left+board_size/3,canvas.height-canvas.height/39);// pirmoji vertikali linija
    strline(board_left+board_size/3*2,board_top,board_left+board_size/3*2,canvas.height-canvas.height/39); //antroji vertikali linija
    strline(board_left,board_top+board_size/3,board_size+board_left,board_top+board_size/3);// pirmoji horizontali linija
    strline(board_left,board_top+board_size/3*2,board_size+board_left,board_top+board_size/3*2);//antroji horizontali linija
    //piesia O ir X
    ctx.strokeStyle="white";
    var counta = 1;
    var countb = 1;
    var arr_i=0;
    for(var i=0;i<=2;i++){
        for(var j=0;j<=2;j++){
            if(kur_piesti_x_ir_o[arr_i]==0){
            drawO(((canvas.width-board_left)/6.3*( counta))+board_left,((canvas.width-board_top)/6.3*(countb))+board_top);               
             }
              if(kur_piesti_x_ir_o[arr_i]==1){
             drawX(0+(board_size/3)*j,0+(board_size/3)*i);
             }
             counta += 2;
            arr_i++;       
        }
        counta=1;
        countb+= 2;
    }
    //piesti zaidimo baigimo langa;
    drawTimer();
    endcard();
 }
// zaidimo techninne puse
function gamesounds(sound,mute){
    if(mute==0){
    switch (sound){
        case "click":
        btclicksound.play();
        break;
        case "win":
        winsound.play();
        break;
        case "draw":
        drawsound.play();
        break;
        case "loose":
        loosesound.play();
        break;
    }  
    } 
}
//ijunkti isjungti event listeneri
function on_off_ingame_click(me){
        if(me!=iam){
            document.getElementById("tictactoegame").removeEventListener('mousedown',choosesquere);
        }
        else{
            document.getElementById("tictactoegame").addEventListener('mousedown',choosesquere);
        }
    
}
        //isvalo zaidimo lauka client puseje
      function restart(){ 
         restart_button_press_color=0;
         exit_button_press_color=0;
         endsound=0;
         on_off_ingame_click(which_player);
         document.getElementById("tictactoegame").removeEventListener('mousedown',pressrestartcolor);
         document.getElementById("tictactoegame").removeEventListener('mouseup',pressrestart);
         document.getElementById("tictactoegame").removeEventListener('mousedown',pressExitcolor);
         document.getElementById("tictactoegame").removeEventListener('mouseup',pressExit);
        endcard();
        //socket.emit('endgame');
      }
      //nustato ar ispaustas restart mygtukas
      function pressrestart(evt){
        var mousePos = getMousePos(canvas, evt);
        if((mousePos.x>=canvas.width/3) && (mousePos.x<=(canvas.width/3)*2)&&(mousePos.y>=canvas.width/1.8)&&(mousePos.y<=(canvas.width/1.8+canvas.height/10))){
            gamesounds("click",mute);
            //btclicksound.play();
            socket.emit('rematch');
            //restart();
        }
        restart_button_press_color=0;
      }
// tikrina ir  nustato zaidimo rezultata
function gamelogic(turn_count){
    var win=2;
        for(var i=0;i<2;i++){
            if((kur_piesti_x_ir_o[0]==i && kur_piesti_x_ir_o[1]==i && kur_piesti_x_ir_o[2]==i)||(kur_piesti_x_ir_o[3]==i && kur_piesti_x_ir_o[4]==i && kur_piesti_x_ir_o[5]==i)||(kur_piesti_x_ir_o[6]==i && kur_piesti_x_ir_o[7]==i && kur_piesti_x_ir_o[8]==i)||(kur_piesti_x_ir_o[0]==i && kur_piesti_x_ir_o[3]==i && kur_piesti_x_ir_o[6]==i)||(kur_piesti_x_ir_o[1]==i && kur_piesti_x_ir_o[4]==i && kur_piesti_x_ir_o[7]==i)||(kur_piesti_x_ir_o[2]==i && kur_piesti_x_ir_o[5]==i && kur_piesti_x_ir_o[8]==i)||(kur_piesti_x_ir_o[0]==i && kur_piesti_x_ir_o[4]==i && kur_piesti_x_ir_o[8]==i)||(kur_piesti_x_ir_o[2]==i && kur_piesti_x_ir_o[4]==i && kur_piesti_x_ir_o[6]==i)){
                win=i;
            }
        }
        if(win!=2 &&turn_count<=9){
            if(win==1){
               ///laimejo X
                    end_rezult=1;
                    sendresults(end_rezult);
                }
            else{  
                //laimejo 0
                end_rezult=0;
                sendresults(end_rezult);
            }
            
        }
        if(win==2 && turn_count==9){
            //lygesios
             end_rezult=2;
             sendresults(end_rezult);
        }
}
    function sendresults(end_rez){
        $.post("/game", {
                    laikas:laikas,
                    ejimai:ejimai,
                    xaro:iam,
                    result:end_rez
                });
       // console.log("posted");
    }
    //Funkcija nustato koordinates canvas elemente
   function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
      function invite(usr_id){    
       var inv=document.getElementById('theusername').innerHTML;
        socket.emit("invite",{id:usr_id,user:inv});
      }
     /* document.getElementById("tictactoegame").addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);
      }, false);
*/
      //-------------------------------------------------------------------------
      //grafine dalis

      //funkcija gauti kintanti teksto dydi zaidimo pavadinimui
      function getFont() {
    var fontBase=1000, fontSize=70;
    var ratio = fontSize / fontBase;   
    var size = canvas.width * ratio;
    return (size|0) + 'px Arial';
}
    function getFonttimer() {
    var fontBase=600, fontSize=25;
    var ratio = fontSize / fontBase;   
    var size = canvas.width * ratio;
    return (size|0) + 'px Arial';
}

//funkcija gauti kintanti teksto dydi zaidimo eimo pranesejam ir restart mygtukui
function getFontt() {
    var fontBase=500, fontSize=25;
    var ratio = fontSize / fontBase;   
    var size = canvas.width * ratio;
    return (size|0) + 'px Arial';
}
//funkcija gauti kintanti teksto dydi zaidimo rezultatui
function getFontend() {
    var fontBase=1000, fontSize=150+end_text_anim();
    var ratio = fontSize / fontBase;   
    var size = canvas.width * ratio;
    return (size|0) + 'px Arial';
}

    //funkcija berzti  lentos linija
    function strline(begin_l,begin_t,end_l,end_t){ 
        ctx.beginPath();
        ctx.moveTo(begin_l,begin_t);
        ctx.lineTo(end_l,end_t);
        ctx.strokeStyle="#7f7e7e";
        ctx.stroke();
    }

    //funkcija piesti zaidimo pavadinima
    function title(){
        ctx.font=getFont();
        ctx.fillStyle = "#7f7e7e";
        ctx.textAlign = "center";
        ctx.fillText("TIC TAC TOE", canvas.width/2,canvas.height/15); //pavadinimas
    }
    //taimeris
        function timerTime(){
        if(thetimeleft>0){
            thetimeleft-=1;
            laikas+=1;
            /*thetimeleft-=0.01;
            laikas+=0.01;*/
        }
        else{
            if(which_player==1)end_rezult=0;              
            else end_rezult=1;
            endcard();
        }
      }
      function drawTimer(){
        var left=canvas.width-(canvas.width*9.5/10);
        var top=canvas.width-(canvas.width*9.25/10);
        var timer_width=thetimeleft/45;
         ctx.font=getFonttimer();
         ctx.fillStyle = "#ffffff";
         ctx.textAlign = "left";
         ctx.fillText("Time: "+Math.round(thetimeleft)+" s",left,(canvas.height/25)); //pavadinimas
         //timerline
         ctx.beginPath();
         ctx.moveTo(left,(canvas.height/17));
         if(timer_width>0){
         ctx.lineTo(left+((left*4.3)*timer_width),(canvas.height/17));
         }
         else{
           ctx.lineTo(left,(canvas.height/17));
          
         }
         ctx.strokeStyle = "#7f7e7e";
         ctx.lineWidth = canvas.height/50;
         ctx.stroke();
     
      }
    //norodys kieno dabar ejimas
    function kieno_ejimas(color_anim){ 
        ctx.font=getFontt();
        ctx.fillStyle = color_anim;
        ctx.textAlign = "left";
        if(iam==which_player){
            ctx.fillText("Your turn", (canvas.width/2)+(canvas.width/4),(canvas.height/18)); //pavadinimas
        }
        else{
            ctx.fillText(kas_eina+"'s turn", (canvas.width/2)+(canvas.width/4),(canvas.height/18)); //pavadinimas
        }
    }

    //Funkcija piesia X
    function drawX(x,y){ 
        var ilgis=canvas.width/9;
        var plotis=canvas.width/5;
        var off=canvas.width/100;
        ctx.beginPath();
        ctx.moveTo(plotis-ilgis+x,plotis-ilgis+y+off);
        ctx.lineTo(plotis+ilgis+x,plotis+ilgis+y+off);
        ctx.strokeStyle="white";
        ctx.lineWidth=canvas.width/40;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(plotis-ilgis+x,plotis+ilgis+y+off);
        ctx.lineTo(plotis+ilgis+x,plotis-ilgis+y+off);
        ctx.stroke();
    }
    //Funkcija piesti 0
    function drawO(locX,locY){
        var radius = canvas.width/10;
        ctx.beginPath();
        ctx.arc(locX,locY, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = canvas.width/40;
        ctx.fillStyle = 'white';
        ctx.stroke();
    }
    //funkcija piesti zaidimo pabaigos langa
    function endcard(){
        if(end_rezult==0 || end_rezult==1 || end_rezult==2){
            document.getElementById("tictactoegame").removeEventListener('mousedown',choosesquere);
            document.getElementById("tictactoegame").addEventListener('mousedown',pressrestartcolor);
            document.getElementById("tictactoegame").addEventListener('mouseup',pressrestart);
            document.getElementById("tictactoegame").addEventListener('mousedown',pressExitcolor);
            document.getElementById("tictactoegame").addEventListener('mouseup',pressExit);
        ctx.fillStyle="rgba(0,0,0,0.9)";
        ctx.fillRect(0,canvas.width/4,canvas.width,canvas.height/2);
        drawrestartbutton(restart_button_press_color);
        drawExit(exit_button_press_color);
        ctx.font=getFontend();
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        if(end_rezult==0){
            if(endsound==0){gamesounds("win",mute);endsound=1;socket.emit('endgame');}
            
            gamestart=0;
            if(iam!=which_player){
                ctx.fillText("You won", canvas.width/2,canvas.width/1.9);
        }
        else{
            ctx.fillText("O won", canvas.width/2,canvas.width/1.9);
        }

        }
        else if(end_rezult==1){
            if(endsound==0){gamesounds("win",mute);endsound=1;socket.emit('endgame');}
            
            gamestart=0;
            if(iam!=which_player){
               ctx.fillText("You won", canvas.width/2,canvas.width/1.9); 
            }
            else{
            ctx.fillText("X won", canvas.width/2,canvas.width/1.9);
                }
        }
        else{
            if(endsound==0){gamesounds("draw",mute);endsound=1;socket.emit('endgame');}      
            gamestart=0;
           ctx.fillText("Draw", canvas.width/2,canvas.width/1.9);
        }
       // clearInterval(count_time);
    }
    }
    //iseiti mygtukas
    function drawExit(colorr){
        if(colorr==1){
            ctx.fillStyle="rgba(150,150,150,1)";
        }
        else{
            ctx.fillStyle="rgba(255,255,255,0.85)";
        }
        ctx.fillRect(canvas.width/3,canvas.width/1.5,canvas.width/3,canvas.height/15);
        ctx.font=getFontt();
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        ctx.fillText("Exit", canvas.width/2,canvas.width/1.4);
      
    }
     function pressExit(evt){

        var mousePos = getMousePos(canvas, evt);
        if((mousePos.x>=canvas.width/3) && (mousePos.x<=(canvas.width/3)*2)&&(mousePos.y>=canvas.width/1.5)&&(mousePos.y<=(canvas.width/1.5+canvas.height/15))){
            //btclicksound.play();
            gamesounds("click",mute);
            socket.emit('exit');
            clearInterval(theboard);
            //clearInterval(count_time);
            document.getElementById("tictactoegame").style.display="none";
            document.getElementById("tictactoegame").removeEventListener('mousedown',choosesquere);
            document.getElementById("tictactoegame").removeEventListener('mousedown',pressrestartcolor);
            document.getElementById("tictactoegame").removeEventListener('mouseup',pressrestart);
            document.getElementById("tictactoegame").removeEventListener('mousedown',pressExitcolor);
            document.getElementById("tictactoegame").removeEventListener('mouseup',pressExit);
            //restart();
            document.getElementById('menu-lobby').style.display="block";
        }
        exit_button_press_color=0;
      }
    function pressExitcolor(evt){
        var mousePos = getMousePos(canvas, evt);
        if((mousePos.x>=canvas.width/3) && (mousePos.x<=(canvas.width/3)*2)&&(mousePos.y>=canvas.width/1.5)&&(mousePos.y<=(canvas.width/1.5+canvas.height/15))){
            exit_button_press_color=1;
        }
        else exit_button_press_color=0;
      }
    //zaisti is naujo mygtukas
      function pressrestartcolor(evt){
        var mousePos = getMousePos(canvas, evt);
        if((mousePos.x>=canvas.width/3) && (mousePos.x<=(canvas.width/3)*2)&&(mousePos.y>=canvas.width/1.8)&&(mousePos.y<=(canvas.width/1.8+canvas.height/10))){
            exit_button_press_color=1;
        }
        else exit_button_press_color=0;
      }
      //-----------

            function drawrestartbutton(colorr){
        if(colorr==1){
            ctx.fillStyle="rgba(150,150,150,1)";
        }
        else{
            ctx.fillStyle="rgba(255,255,255,0.85)";
        }
        ctx.fillRect(canvas.width/3,canvas.width/1.8,canvas.width/3,canvas.height/10);
        ctx.font=getFontt();
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        ctx.fillText("žaisti is naujo", canvas.width/2,canvas.width/1.62);
      }
      //animaciju funkcijos

      //funkcija kieno eijimas uzraso spalvai keitimo animacija
    function color_animation(){ 
        if(turn_text_color<255 && color_anim_var==0){          
             turn_text_color+=6;
        }
        else if(turn_text_color>=255){
            color_anim_var=1;          
            turn_text_color-=6;
        }
        else if(turn_text_color>126 && color_anim_var==1){   
             turn_text_color-=6;
        }
        else{
            color_anim_var=0;
            turn_text_color+=6;
        }
        return "rgb("+turn_text_color+","+turn_text_color+","+turn_text_color+")";
    }

    // funkcija zaidimo baigimo lenteles uzraso kas laimejo teksto dydzio kitimo animacijai
     function end_text_anim(){
        if(end_card_text_size<10 && size_anim_var==0){          
             end_card_text_size+=0.96;
        }
        else if(end_card_text_size>=10){
            size_anim_var=1;          
            end_card_text_size-=0.96;
        }
        else if(end_card_text_size>-10 && size_anim_var==1){   
             end_card_text_size-=0.96;
        }
        else{
            size_anim_var=0;
            end_card_text_size+=0.96;
        }
        return end_card_text_size;
    }
//-------------------------------------------------------------------------
// perima zaidimo duomenis is serverio
function getServerData(data){
            kas_eina=data.kas_eina;
            kur_piesti_x_ir_o[0]=data.xo0;
            kur_piesti_x_ir_o[1]=data.xo1;
            kur_piesti_x_ir_o[2]=data.xo2;
            kur_piesti_x_ir_o[3]=data.xo3;
            kur_piesti_x_ir_o[4]=data.xo4;
            kur_piesti_x_ir_o[5]=data.xo5;
            kur_piesti_x_ir_o[6]=data.xo6;
            kur_piesti_x_ir_o[7]=data.xo7;
            kur_piesti_x_ir_o[8]=data.xo8;
            turn_text_color=data.turn_text_color;
            end_card_text_size=data.end_card_text_size;
            turn_count=data.turn_count;
            which_player=data.which_player;
            end_rezult=data.end_rezult;
            thetimeleft=data.thetimeleft;
}

//pagrindine paspaudimo funkcija      //funkcija suzinoti kuri langeli canvas elemente paspaude
      function choosesquere(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        var board_left=canvas.width-(canvas.width*9.5/10);
        var board_top=canvas.width-(canvas.width*9.25/10);
        var board_size=canvas.width*9/10;
        var leftspace=canvas.width-(canvas.width*9/10);

        if((mousePos.x>=board_left)&&(mousePos.x<=board_size+board_left)&&(mousePos.y>=board_top)&&(mousePos.y<=board_size+board_top)){
            //pastaudimu fiksavimas
            // 1-langelis
            //btclicksound.play();
            gamesounds("click",mute);
           if((mousePos.x<=board_size/3+board_left)&&(mousePos.y<=board_size/3+board_top)){
            ejimai++;
                if(which_player==1){
                    if(kur_piesti_x_ir_o[0]==2){
                        kur_piesti_x_ir_o[0]=1;
                        which_player=0;
                        kas_eina="O";
                        turn_count++;
                    }
                   
                }
                else{
                    if(kur_piesti_x_ir_o[0]==2){
                        kur_piesti_x_ir_o[0]=0;
                        which_player=1;
                        kas_eina="X";
                        turn_count++;
                    }
                    
                }
            }
            //2-as langelis
           else if((mousePos.x>=board_size/3+board_left)&&(mousePos.y<board_size/3+board_top)&&(mousePos.x<=board_size/3*2+board_left)&&(mousePos.y<board_size/3+board_top)){
            ejimai++;
                if(which_player==1){
                    if(kur_piesti_x_ir_o[1]==2){
                        kur_piesti_x_ir_o[1]=1;
                        which_player=0;
                        kas_eina="O"; 
                        turn_count++;
                    }
                   
                }
                else{
                    if(kur_piesti_x_ir_o[1]==2){
                        kur_piesti_x_ir_o[1]=0;
                        which_player=1;
                        kas_eina="X";
                        turn_count++;
                    }
                    
                }
            }
            //3-as langelis
           else if((mousePos.x>board_size/3*2+board_left)&&(mousePos.y<=board_size/3+board_top)&&(mousePos.x<board_size+board_left)){
            ejimai++;
                if(which_player==1){
                    if(kur_piesti_x_ir_o[2]==2){
                        kur_piesti_x_ir_o[2]=1;
                        which_player=0;
                        kas_eina="O"; 
                        turn_count++;
                    }
                   
                }
                else{
                    if(kur_piesti_x_ir_o[2]==2){
                        kur_piesti_x_ir_o[2]=0;
                        which_player=1;
                        kas_eina="X";
                        turn_count++;
                    }
                    
                }
            }
            //4-as langelis
           else if((mousePos.x<=board_size/3+board_left)&&(mousePos.y<board_size/3*2+board_top)&&(mousePos.x<=board_size/3*2+board_left)&&(mousePos.y>board_size/3+board_top)){
            ejimai++;
                if(which_player==1){
                    if(kur_piesti_x_ir_o[3]==2){
                        kur_piesti_x_ir_o[3]=1;
                        which_player=0;
                        kas_eina="O"; 
                        turn_count++;
                    }
                   
                }
                else{
                    if(kur_piesti_x_ir_o[3]==2){
                        kur_piesti_x_ir_o[3]=0;
                        which_player=1;
                        kas_eina="X";
                        turn_count++;
                    }
                    
                }
            }

            //5-as langelis
           else if((mousePos.x>board_size/3+board_left)&&(mousePos.y<=board_size/3*2+board_top)&&(mousePos.x<board_size/3*2+board_left)&&(mousePos.y>=board_size/3+board_top)){
            ejimai++;
                if(which_player==1){
                    if(kur_piesti_x_ir_o[4]==2){
                        kur_piesti_x_ir_o[4]=1;
                        which_player=0;
                        kas_eina="O";
                        turn_count++; 
                    }
                   
                }
                else{
                    if(kur_piesti_x_ir_o[4]==2){
                        kur_piesti_x_ir_o[4]=0;
                        which_player=1;
                        kas_eina="X";
                        turn_count++;
                    }
                    
                }
            }
            //6-as langelis
           else if((mousePos.x<=board_size+board_left)&&(mousePos.y<board_size/3*2+board_top)&&(mousePos.x>=board_size/3*2+board_left)&&(mousePos.y>board_size/3+board_top)){
            ejimai++;
                if(which_player==1){
                    if(kur_piesti_x_ir_o[5]==2){
                        kur_piesti_x_ir_o[5]=1;
                        which_player=0;
                        kas_eina="O"; 
                        turn_count++;
                    }
                   
                }
                else{
                    if(kur_piesti_x_ir_o[5]==2){
                        kur_piesti_x_ir_o[5]=0;
                        which_player=1;
                        kas_eina="X";
                        turn_count++;
                    }
                    
                }
            }
            //7-as langelis
          else if((mousePos.x<board_size/3+board_left)&&(mousePos.y>=board_size/3*2+board_top)){
            ejimai++;
                if(which_player==1){
                    if(kur_piesti_x_ir_o[6]==2){
                        kur_piesti_x_ir_o[6]=1;
                        which_player=0;
                        kas_eina="O"; 
                        turn_count++;
                    }
                   
                }
                else{
                    if(kur_piesti_x_ir_o[6]==2){
                        kur_piesti_x_ir_o[6]=0;
                        which_player=1;
                        kas_eina="X";
                        turn_count++;
                    }
                    
                }
            }
            //8-as langelis
           else if((mousePos.x>=board_size/3+board_left)&&(mousePos.y>board_size/3*2+board_top)&&(mousePos.x<=board_size/3*2+board_left)&&(mousePos.y>board_size/3*2+board_top)){
            ejimai++;
                if(which_player==1){
                    if(kur_piesti_x_ir_o[7]==2){
                        kur_piesti_x_ir_o[7]=1;
                        which_player=0;
                        kas_eina="O"; 
                        turn_count++;
                    }
                   
                }
                else{
                    if(kur_piesti_x_ir_o[7]==2){
                        kur_piesti_x_ir_o[7]=0;
                        which_player=1;
                        kas_eina="X";
                        turn_count++;
                    }
                    
                }
            }

                else{
                    ejimai++;
                if(which_player==1){
                    if(kur_piesti_x_ir_o[8]==2){
                        kur_piesti_x_ir_o[8]=1;
                        which_player=0;
                        kas_eina="O"; 
                        turn_count++;
                    }
                   
                }
                else{
                    if(kur_piesti_x_ir_o[8]==2){
                        kur_piesti_x_ir_o[8]=0;
                        which_player=1;
                        kas_eina="X";
                        turn_count++;
                    }     
                }
            }
           //--------
           thetimeleft=45;
        }          
         socket.emit('turn',{
            xo0: kur_piesti_x_ir_o[0],
            xo1: kur_piesti_x_ir_o[1],
            xo2: kur_piesti_x_ir_o[2],
            xo3: kur_piesti_x_ir_o[3],
            xo4: kur_piesti_x_ir_o[4],
            xo5: kur_piesti_x_ir_o[5],
            xo6: kur_piesti_x_ir_o[6],
            xo7: kur_piesti_x_ir_o[7],
            xo8: kur_piesti_x_ir_o[8],
            turn_count: turn_count,
            kas_eina: kas_eina,
            which_player: which_player,
            end_rezult: end_rezult,
            thetimeleft: thetimeleft,
            turn_text_color: turn_text_color,
            end_card_text_size: end_card_text_size        
        });  
        on_off_ingame_click(which_player);
        gamelogic(turn_count);
      }