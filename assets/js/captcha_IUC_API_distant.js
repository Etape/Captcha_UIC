var type="";
var times={lat:0,comp:0,minTyp:100000,minSel:100000};
var lat= Date.now();
var logo="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/images/powered_by_logo2.png";
var loading_gif="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/images/loading2.gif";
var done_img="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/images/done.png";
var not_done_img="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/images/not_done.png";
var reload_img="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/images/reload.png";

function testKeys(){
    console.log('testing keys ...');
    var xhr = new XMLHttpRequest();
    let url = new URL('http://127.0.0.1:5000/testKeys');
    //url.searchParams.set('q', 'test me!');
    xhr.open("GET", url + '?userKey=' + Captcha_UIT_Token.UserKey + '&APIkeys='
     + Captcha_UIT_Token.APIKey, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.onreadystatechange = () => { // Call a function when the state changes.  
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            if (xhr.responseText != "False") {
                type=xhr.responseText;
                if(xhr.responseText != "soft"){
                    let im=captcha_get_images(xhr.responseText);

                }
                else if(xhr.responseText == "soft"){
                    draw_captchas(xhr.responseText);
                }
            }
            else{
                alert("Impossible de charger vos Captchas, Veuillez réessayer ou verifiez vos Clés d'accès");
            }
        }
    }   
    xhr.send();
}

function captcha_get_images(type){
    if(type!='images'){
        return captcha_loadCaptcha(type);
    }
    return captcha_loadImages();
}

function draw_captchas(type,image){
    var container=document.getElementById("captcha_iuc");
    container.style.textAlign='center';
    if(type=='soft'){
        container.innerHTML='<div id="soft_captcha"  style="height: 45px; width: 60%;margin-bottom: 20px;margin-left: 20%; display: flex;padding-top: 5px;padding-left: 20px;">'+
        '<input id="captcha_check_soft" type="checkbox" style="height: 30px; width: 30px; padding: 5px; margin-right: 20px;" onchange="captcha_softcheck()">'+
        '<img id="captcha_soft_loading" src="'+loading_gif+'" height="30" width="30" style="margin-right: 20px;display: none;">'+
        '<img id="captcha_soft_done" src="'+done_img+'" height="30" width="30" style="margin-right: 20px;display: none;">'+
        '<img id="captcha_soft_not_done" src="'+not_done_img+'" height="30" width="30" style="margin-right: 20px;display: none;">'+
        '<p><b>Je ne suis pas un robot</b></p>'+
        '</div>'
        +'<img src="'+logo+'" class="w-100" height="100" alt="...">';
    }
    else if(type=='words'){
        container.innerHTML='<div id="word_captcha" class="bg-light" style="text-align: center;margin-bottom: 20px;">'
        +'<p>Saisissez le texte dans l\'image</p>'
        +'<div id="captcha_words_canvas" style="text-align: center;height: 100px; width: 80%;margin-left: 10%;">'
        +'<img src="'+image+'" style="margin-top: -15px ; height: 100px; width: 100%; padding: 5px;">'
        +'</div>'
        +'<input id="captcha_words_input" onkeypress="captcha_update_typ()" type="text" class="input" placeholder="saisissez le mot caché dans l\'image" style="height: 40px;text-align: center; width: 60%;margin-bottom: 20px;">'
        +'<div style="text-align: center;">'
        +'<img src="'+reload_img+'" style="margin-top: -15px ; height: 45px; width: 45px; padding: 5px; margin-right: 50px;" onclick="captcha_createCaptcha()">'
        +'<button  id="captcha_valid_captcha" class="btn btn-primary" style="height: 45px; width: 40%;margin-bottom: 20px;" onclick="captcha_testAnswer()">'
        +'<img id="captcha_words_loading" src="'+loading_gif+'" height="30" width="30" style="display: none;">'
        +'Valider'
        +'</button>'
        +'</div>'
        +'</div>'
        +'<img src="'+logo+'" class="w-100" height="100" alt="...">';
    }
    else if(type=='3D'){
        container.innerHTML='<div id="3D_captcha" class="bg-light" style="text-align: center;margin-bottom: 20px;">'
        +'<p>Saisissez le texte dans l\'image</p>'
        +'<div id="captcha_3D_canvas" style="text-align: center;height: 100px; width: 80%;margin-left: 10%;">'
        +'<img src="'+image+'" style="margin-top: -15px ; height: 100px; width: 100%; padding: 5px;">'
        +'</div>'
        +'<input id="captcha_3D_input" onkeypress="captcha_update_typ()" type="text" class="input" placeholder="saisissez le mot caché dans l\'image" style="height: 40px;text-align: center; width: 60%;margin-bottom: 20px;">'
        +'<div style="text-align: center;">'
        +'<img src="'+reload_img+'" style="margin-top: -15px ; height: 45px; width: 45px; padding: 5px; margin-right: 50px;" onclick="captcha_createCaptcha()">'
        +'<button  id="captcha_valid_captcha" class="btn btn-primary" style="height: 45px; width: 40%;margin-bottom: 20px;" onclick="captcha_testAnswer()">'
        +'<img id="captcha_3D_loading" src="'+loading_gif+'" height="30" width="30" style="display: none;">'
        +'Valider'
        +'</button>'
        +'</div>'
        +'</div>'
        +'<img src="'+logo+'" class="w-100" height="100" alt="...">';

    }
    else if(type=='maths'){
        container.innerHTML='<div id="maths_captcha" class="bg-light" style="text-align: center;margin-bottom: 20px;">'
        +'<p>Saisissez le texte dans l\'image</p>'
        +'<div id="captcha_maths_canvas" style="text-align: center;height: 100px; width: 80%;margin-left: 10%;">'
        +'<img src="'+image+'" style="margin-top: -15px ; height: 100px; width: 100%; padding: 5px;">'
        +'</div>'
        +'<input id="captcha_maths_input"  onkeypress="captcha_update_typ()" type="text" class="input" placeholder="saisissez le mot caché dans l\'image" style="height: 40px;text-align: center; width: 60%;margin-bottom: 20px;">'
        +'<div style="text-align: center;">'
        +'<img src="'+reload_img+'" style="margin-top: -15px ; height: 45px; width: 45px; padding: 5px; margin-right: 50px;" onclick="captcha_createCaptcha()">'
        +'<button  id="captcha_valid_captcha" class="btn btn-primary" style="height: 45px; width: 40%;margin-bottom: 20px;" onclick="captcha_testAnswer()">'
        +'<img id="captcha_maths_loading" src="'+loading_gif+'" height="30" width="30" style="display: none;">'
        +'Valider'
        +'</button>'
        +'</div>'
        +'</div>'
        +'<img src="'+logo+'" class="w-100" height="100" alt="...">';
    }
    else if(type=='images'){
        var subject=image.split('[')[1];
        var images=image.split('[')[0].split('#');
        container.innerHTML='<div id="images_captcha" class="bg-light" style="text-align: center;margin-bottom: 20px;">'
            +'<table style="margin-left: 5%; width: 90%;margin-bottom: 20px;">'
            +    '<div  style="width: 90%;margin-left: 5%; padding-top: 15px; background-color: darkcyan;padding-bottom: 15px;">'
            +        '<p id="subject">Choisir toutes les images contenant un(e) '+subject+' </p>'
            +    '</div>'
            +    '<tbody>'
            +        '<tr>'
            +            '<td><img src="'+images[0]+'" style="position:relative;width: 100%;height: 98%;object-fit:cover;object-position: 50% 50%; outline: 1px solid azure;" onclick="select(this,0)"></td>'
            +            '<td><img src="'+images[1]+'" style="position:relative;width: 100%;height: 98%;object-fit:cover;object-position: 50% 50%; outline: 1px solid azure;" onclick="select(this,1)"></td>'
            +            '<td><img src="'+images[2]+'" style="position:relative;width: 100%;height: 98%;object-fit:cover;object-position: 50% 50%; outline: 1px solid azure;" onclick="select(this,2)"></td>'
            +        '</tr>'
            +        '<tr>'
            +            '<td><img src="'+images[3]+'" style="position:relative;width: 100%;height: 100%;object-fit:cover;object-position: 50% 50%; outline: 1px solid azure;" onclick="select(this,3)"></td>'
            +            '<td><img src="'+images[4]+'" style="position:relative;width: 100%;height: 100%;object-fit:cover;object-position: 50% 50%; outline: 1px solid azure;" onclick="select(this,4)"></td>'
            +            '<td><img src="'+images[5]+'" style="position:relative;width: 100%;height: 100%;object-fit:cover;object-position: 50% 50%; outline: 1px solid azure;" onclick="select(this,5)"></td>'
            +        '</tr>'
            +        '<tr>'
            +            '<td><img src="'+images[6]+'" style="position:relative;width: 100%;height: 100%;object-fit:cover;object-position: 50% 50%; outline: 1px solid azure;" onclick="select(this,6)"></td>'
            +            '<td><img src="'+images[7]+'" style="position:relative;width: 100%;height: 100%;object-fit:cover;object-position: 50% 50%; outline: 1px solid azure;" onclick="select(this,7)"></td>'
            +            '<td><img src="'+images[8]+'" style="position:relative;width: 100%;height: 100%;object-fit:cover;object-position: 50% 50%; outline: 1px solid azure;" onclick="select(this,8)"></td>'
            +        '</tr>'
            +    '</tbody>'
            +'</table>'
            +'<div style="text-align: center;">'
            +    '<img src="'+reload_img+'" style="margin-top: -15px ; height: 45px; width: 45px; padding: 5px; margin-right: 50px;" i="Changer d\'image">'
            +    '<button id="images_valid_captcha"  onclick="captcha_testAnswer()" class="btn btn-primary" style="height: 45px; width: 40%;margin-bottom: 20px;">'
            +        '<img id="captcha_images_loading" src="'+loading_gif+'" height="30" width="30" style="display:none">'
            +        'Valider'
            +    '</button>'
            +'</div>'
        +'</div>'
        +'<img src="'+logo+'" class="w-100" height="100" alt="...">';

    }
}
function captcha_createCaptcha()
{
    if(type!= "soft"){
        let im=captcha_get_images(type);
    }
    else if(type== "soft"){
        draw_captchas(type);
    }
}

function select(e,num){
    if(e.style.borderRadius!='5px'){
        e.style.outline="3px solid blue";
        e.style.borderRadius="5px";
        captcha_update_selections(num,'sel');
    }
    else{
        e.style.outline="0px solid blue";
        e.style.borderRadius="0px";
        captcha_update_selections(num,'unsel');
    }
}
var sels=[];
function captcha_update_selections(num,s){
    if(s=='sel'){
        sels.push(num);
    }
    else{
        sels=sels.filter(n => n != num);
    }
    captcha_update_sel();
    console.log(sels);

}

function captcha_softcheck(){
    document.getElementById("captcha_check_soft").style.display="none";
    document.getElementById("captcha_soft_loading").style.display="inline-block";
    
    var millisecondsToWait = 1000;
    setTimeout(function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", 'http://127.0.0.1:5000/testSoft' + '?times=' + captcha_times_catcher('soft'), true);
        console.log(captcha_times_catcher('soft'));
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.onreadystatechange = () => { // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                if (xhr.responseText == "OK") {
                    document.getElementById("captcha_soft_loading").style.display="none";
                    document.getElementById("captcha_soft_done").style.display="inline-block";
                    Captcha_UIT_Token.result="Passed";
                    captcha_iuc_onsuccess();
                }
                else{
                    document.getElementById("captcha_soft_loading").style.display="none";
                    document.getElementById("captcha_soft_not_done").style.display="inline-block";
                    Captcha_UIT_Token.result="Failed";
                    captcha_iuc_onfailure();
                }
            }
            else{
                captcha_iuc_onerror();
            }
        }
        xhr.send();
    }, millisecondsToWait);
}

var firstSel=0;
var firstTyp=0;

function captcha_times_catcher(type){
    if (type == 'soft') {
        times.lat= Date.now()-lat;   
    }
    if (type == 'maths' || type == '3D' || type == 'words' || type == 'images') {
        times.lat = (Date.now()) - lat;   
        times.comp = (Date.now()) - times.comp;   
    }
    return times.lat+'_'+times.comp+'_'+times.minTyp+'_'+times.minSel;
}
var prevSel=Date.now();
function captcha_update_sel(){
    if(firstSel==0){
        prevSel=Date.now();
        times.comp=Date.now();
        firstSel=1;
    }
    else{
        var diff_sel = Date.now()-prevSel;
        if(diff_sel<times.minSel){
            times.minSel = diff_sel;
        }
        prevSel=Date.now();
    }
}
var prevTyp=Date.now();
function captcha_update_typ(){
    console.log('typing ...')
    if(firstTyp == 0){
        prevTyp=Date.now();
        times.comp=Date.now();
        firstTyp = 1;
    }
    else{
        var diff_typ = Date.now()-prevTyp;
        if(diff_typ<times.minTyp){
            times.minTyp = diff_typ;
        }
        prevTyp=Date.now();
    }
}

function captcha_testAnswer(){
    var answer='';
    var loading = document.getElementById("captcha_"+type+"_loading") 
    if(type!='images'){
        var inp = document.getElementById("captcha_"+type+"_input")
        answer=inp.value;
    }
    else{
        for(var j=0;j<9;j++){
            var el='0';
            for(var i=0;i<sels.length;i++){
                if(j==sels[i]){
                    el='1';
                    break;
                }
            }   
            answer+=el+'-';
        }
    }
    console.log(answer);
    loading.style.display="inline-block";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://127.0.0.1:5000/testAnswer' + '?answer=' + answer 
    + '&times=' + captcha_times_catcher(type) + '&type=' + type, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.onreadystatechange = () => { // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            loading.style.display="none";   
            if (xhr.responseText == "OK") {
                Captcha_UIT_Token.result="Passed";
                captcha_iuc_onsuccess();
            }
            else{
                Captcha_UIT_Token.result="Failed";
                captcha_iuc_onfailure();
                //draw_captchas(type);
                alert("Echec de test Captcha, Veuillez recharger la page pour réessayer");
            }
        }
    }
    
    xhr.send();
}

function captcha_loadImages(){
    var xhr = new XMLHttpRequest();
    console.log('fetching image ...');
    xhr.open("GET", 'http://127.0.0.1:5000/getImages', false);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.onreadystatechange = () => { // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {        
            console.log(xhr.responseText);
            draw_captchas('images',xhr.responseText);
        }
        else{
            alert("Impossible de charger vos Captchas, Veuillez recharger la page");
        }
    }
    xhr.send();
}

function captcha_loadCaptcha(type){
    var xhr = new XMLHttpRequest();
    console.log('fetching image ...');
    if(type=='maths')
        xhr.open("GET", 'http://127.0.0.1:5000/getMaths', false);
    if(type=='words')
        xhr.open("GET", 'http://127.0.0.1:5000/getWord', false);
    if(type=='3D')
        xhr.open("GET", 'http://127.0.0.1:5000/get3d', false);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.onreadystatechange = () => { // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {        
            console.log(xhr.responseText);
            draw_captchas(type,xhr.responseText);
        }
        else{
            alert("Impossible de charger vos Captchas, Veuillez recharger la page");
        }
    }
    
    xhr.send();
}
testKeys();

<html>
<head>
<link rel="stylesheet" href="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/css/bootstrap-theme.css" />
<link rel="stylesheet" href="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/css/bootstrap.min.css" />
</head>
<body>
<div id="captcha_iuc">
</div>
</body>
<script >
var captcha_result="";
var Captcha_UIT_Token={
UserKey: ‘userkey’,
APIKey: ‘apiKey’
};
function captcha_iuc_onsuccess(){
captcha_result="success";
... Ecrivez votre code de succes ici
}
function captcha_iuc_onfailure(){
captcha_result="failure";
... Ecrivez votre code d'echec ici
}
function captcha_iuc_onerror(){
... Ecrivez votre code de gestion d'erreur ici

}
</script >
<script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js" > </script >
<script src="https://storage.googleapis.com/recaptcha-uic.appspot.com/Recaptcha_js/core/captcha_IUC_API_distant.js" > </script >
</html >

