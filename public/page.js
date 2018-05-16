window.onload=function(){
    loginpos();
 }
window.onresize=function(){
    loginpos();
 }

 //puslapio funkcijos
function loginpos(){
    var device_height=window.innerHeight;
    var login_h=document.getElementById("login").style.height;
    document.getElementById("login").style.marginTop=(device_height/3)+"px";

}
