
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
function checkCookie() {
    let usermail = getCookie("usermail");
    if (usermail != "") {
      window.location.replace("../dashboard/index.html");
    } 
    else{
      console.log('no userfound');
    }
}
function signOut(){
    setCookie("usermail", '', -1);
    setCookie("userpass", '', -1);
    setCookie("username", '', -1);
    setCookie("userpre", '', -1);
    setCookie("userkey", '', -1);
    window.location.replace("../sign-in/index.html");
}
var usermail=getCookie('usermail');
var userpass=getCookie('userpass');
var userid=getCookie('userid');

function show_credentials(credentials){
    var apikey=credentials.split(' ')[0];
    var userkey=credentials.split(' ')[1];

    document.getElementById("apikeys").innerHTML='UserKey:'+userkey+' <br> APIKey:'+apikey;

    document.getElementById("howtouse").innerHTML=
    '    &lt;html&gt; <br>'+
    '    &lt;head&gt;'+
    '    <p class="ml-2" style="font-size: 20px;margin-left: 20px; color: yellow;">'+
    '        &lt;link rel="stylesheet" href="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/css/bootstrap-theme.css" /&gt;<br>'+
    '        &lt;link rel="stylesheet" href="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/css/bootstrap.min.css" /&gt;<br>'+ 
    '    </p>'+
    '    &lt;/head&gt; <br>'+
    '    &lt;body&gt; <br>'+
    '    &lt;div id="captcha_iuc"&gt; <br>'+
    '    &lt;/div&gt; <br>'+
    '    &lt;/body&gt;  <br>    '+
    '   &lt;script &gt; <br>'+
    '    <p class="ml-2" style="font-size: 20px;margin-left: 20px;">'+
    '         var captcha_result="";<br>'+
    '         var Captcha_UIT_Token={'+
    '            <p class="ml-3" style="font-size: 20px;margin-left: 20px;color: green;" >'+
    '            UserKey: '+userkey+',<br>'+
    '            APIKey: '+apikey+'<br>'+
    '            </p>'+
    '        };<br>'+
	'	function captcha_iuc_onsuccess(){<br>'+
	'		captcha_result="success";<br>'+
	'		... Ecrivez votre code de succes ici <br>'+
	'	}<br>'+
	'	function captcha_iuc_onfailure(){<br>'+
	'		captcha_result="failure";<br>'+
	'		... Ecrivez votre code d\'echec ici <br>'+
	'	}<br>'+
	'	function captcha_iuc_onerror(){<br>'+
	'		... Ecrivez votre code de gestion d\'erreur ici <br>'+
	'		<br>'+
	'	}<br>'+
    '    </p>'+
    '    &lt;/script &gt;<br>'+
    '    &lt;script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js" &gt; &lt;/script &gt; <br>'+
    '    &lt;script src="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/core/captcha_IUC_API_distant.js" &gt; &lt;/script &gt; <br>'+
    '    &lt;/html &gt; <br>';

    document.getElementById("apikeys_section").style.display="inline-block";
    document.getElementById("howtouse_section").style.display="inline-block";
    element=document.getElementById("apikeys_section");
    element.scrollTop = element.scrollHeight;
}

function captcha_register_user(){
    var email=document.getElementById("email");
    var password=document.getElementById("password");
    var password_conf=document.getElementById("password_confirmed");
    var f_name=document.getElementById("first_name");
    var l_name=document.getElementById("last_name");

    if(email.value==''){
        email.style.borderColor='red';
    }
    else if(password.value=='' || password.value!=password_conf.value){
        password.style.borderColor='red';
    }
    else if(document.getElementById("accept_terms").checked!=true) {
        document.getElementById("accept_terms").style.backgroundColor='red';
    }
    else if(captcha_result==""){
        setTimeout(function() {
            console.log('waiting captcha results ... ');
            captcha_register_user();
        },500);
    }
    else if(captcha_result=="failure"){
        alert('captcha failed');
        captcha_createCaptcha();
    }
    else{
        
        console.log('captcha result: '+captcha_result);
        var xhr = new XMLHttpRequest();
        console.log('connecting ...');
        xhr.open("GET", 'http://127.0.0.1:5000/registerUser'+'?email='+email.value+'&password='+password.value
        +'&first_name='+f_name.value+'&last_name='+l_name.value, false);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.onreadystatechange = () => { // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {        
                if(xhr.responseText!='False')
                {
                    setCookie('usermail',email.value,30);
                    setCookie('userpass',password.value,30);
                    setCookie('userid',xhr.responseText,30);
                    alert("Enregistrement reussi !");
                    location.replace("index.html");
                }
            }
            else{
                alert("Impossible de charger vos Captchas, Veuillez recharger la page");
            }
        }
        xhr.send();
    }
}
function captcha_register_sale(type){
    var xhr = new XMLHttpRequest();
    console.log('connecting ...');
    xhr.open("GET", 'http://127.0.0.1:5000/registerSale'+'?type='+type+'&user_id='+getCookie('userid'), false);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.onreadystatechange = () => { // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {        
            if(xhr.responseText!='False')
            {
                show_credentials(xhr.responseText);
            }
        }
        else{
            alert("Impossible de charger vos Captchas, Veuillez recharger la page");
        }
    }
    xhr.send();
}

function captcha_signin_user(){
    var email=document.getElementById("email");
    var password=document.getElementById("password");
    if(email.value==''){
        email.style.borderColor='red';
    }
    else if(password.value==''){
        password.style.borderColor='red';
    }
    else{
        var xhr = new XMLHttpRequest();
        console.log('connecting ...');
        xhr.open("GET", 'http://127.0.0.1:5000/signinUser'+'?email='+email.value+'&password='+password.value, false);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.onreadystatechange = () => { // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {          
                if(xhr.responseText!='False')
                {
                    setCookie('usermail',email.value,30);
                    setCookie('userpass',password.value,30);
                    setCookie('userid',xhr.responseText,30);
                    //alert("Login reussi");
                    location.replace("index.html");
                }
            }
            else{
                alert("Impossible de charger vos informations");
            }
        }
        xhr.send();
    }
}
