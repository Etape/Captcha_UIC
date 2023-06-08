import json
from flask import Flask,request,g,session
import string 
import random 
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, storage
import os 
import time
from flask_cors import CORS
from flask_session import Session

os.chdir("Recaptcha_UIT")
cred = credentials.Certificate("API/recaptcha-uic-firebase-adminsdk-tnftx-0485752be3.json")
firebase_admin.initialize_app(cred,{'storageBucket': 'recaptcha-uic.appspot.com'})

db = firestore.client()

app = Flask(__name__)

def most_frequent(List):
    return max(set(List), key = List.count)

def Evaluate_times(times,typ):
    times_=times.split('_') #in ms
    latency=int(times_[0])
    completion=int(times_[1])
    minTyping=int(times_[2])
    minSelecting=int(times_[3])
    print("evaluating times ...")
    if typ=='soft' and latency>=1500:
        return True
    if typ=='words' and latency>=1500 and completion>=2000 and minTyping>=200:
        return True
    if typ=='3D' and latency>=1500 and completion>=2000 and minTyping>=200:
        return True
    if typ=='maths' and latency>=1500 and completion>=1500 and minTyping>=200:
        return True
    if typ=='images' and latency>=1500 and completion>=1500 and minSelecting>=150:
        return True
    return False

def generate_captcha(type_,N):
    n=random.randint(0, N+1)
    words = db.collection('Captchas').where('type','==',type_).where('position','==',n).stream()
    for word in words:
        datas=word.to_dict()
        return datas['image'],datas['solution']

def generate_captcha_images():
    N=800
    positions=[]
    images=[]
    results=[]
    for i in range(9):
        positions.append(random.randint(0, N+1))
    for pos in positions:
        words = db.collection('Captchas').where('type','==','images').where('position','==',pos).stream()
        for word in words:
            datas=word.to_dict()
            images.append(datas['image'])
            results.append(datas['solution'])
            break
    return images,results

def save_result(result):
    file1 = open("result.txt","w")
    file1.write(result)
    file1.close() #to change file access modes
    
def get_result():
    file1 = open("result.txt","r+")
    return file1.read()
@app.route('/')
def index():
    return "Welcome to CAPTCHA IUC API"

@app.route('/getWord', methods=['GET'])
def getWord():
    im_,resultw=generate_captcha('word',132)
    return im_

@app.route('/get3d', methods=['GET'])
def get3d():
    im_,resultw=generate_captcha('3D',1)
    return im_

@app.route('/getMaths', methods=['GET'])
def getMaths():
    im_,resultw=generate_captcha('maths',92)
    return im_

@app.route('/getImages', methods=['GET'])
def getImages():
    ims_,results = generate_captcha_images()
    print(results)
    im_=""
    for im in ims_:
        im_ += im + "#"
    subject = most_frequent(results)
    resultw = ""
    for res in results:
        if res == subject :
            resultw += "1-"
        else:
            resultw += "0-"
    print(resultw)
    save_result(resultw)
    return im_+'['+subject

@app.route('/testAnswer', methods=['GET'])
def testAnswer():
    answer = request.args.get('answer')
    times = request.args.get('times')
    type_ = request.args.get('type')
    print(get_result() +' ********* '+ answer)
    if answer==get_result()+"" and Evaluate_times(times,type_):
        return "OK" 
    else:
        return "False"

@app.route('/testSoft', methods=['GET'])
def testSoft():
    times = request.args.get('times')
    print(times)
    if Evaluate_times(times,'soft'):
        return "OK" 
    else:
        return "False"

@app.route('/testKeys', methods=['GET'])
def testKeys():
    userKey = request.args.get('userKey')
    APIkeys = request.args.get('APIkeys')
    users = db.collection('Sales').where('user_key','==',userKey).where('API_key','==',APIkeys).stream()
    for user in users:
        datas=user.to_dict()
        return datas['type']
    return "False"
@app.route('/registerSale', methods=['GET'])
def registerSale():
    user_id = request.args.get('user_id')
    type_ = request.args.get('type')
    saleref = db.collection('Sales').document()
    user_key=saleref.getId()
    API_key=user_id+'%'+user_key
    saleref.set({
        'user_key':user_key,
        'type':type_,
        'user_id':user_id,
        'API_key':API_key,
        'date': time.time()
    })
    return API_key+' '+user_key
@app.route('/registerUser', methods=['GET'])
def registerSale():
    first_name = request.args.get('first_name')
    last_name = request.args.get('last_name')
    email = request.args.get('email')
    password = request.args.get('password')
    userref = db.collection('Sales').document()
    saleref.set({
        'first_name':first_name,
        'last_name':last_name,
        'email':email,
        'password':password
    })
    return "OK"

CORS(app, support_credentials=True)
app.run(host='0.0.0.0')