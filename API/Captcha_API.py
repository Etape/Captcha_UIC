import json
from flask import Flask
import string 
import random 
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, storage

cred = credentials.Certificate("API/recaptcha-uic-firebase-adminsdk-tnftx-0485752be3.json")
firebase_admin.initialize_app(cred,{'storageBucket': 'recaptcha-uic.appspot.com'})

db = firestore.client()

app = Flask(__name__)

def most_frequent(List):
    return max(set(List), key = List.count)

def Evaluate_times(times,typ):
    times_=times.split('#') #in ms
    latency=int(times_[0])
    completion=int(time_[1])
    minTyping=int(time_[2])
    minSelecting=int(time_[3])
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
    

@app.route('/')
def index():
    return "Welcome to CAPTCHA IUC API"

resultw=""

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
    im=""
    for im in ims_:
        im_ += im + "#"
    subject = most_frequent(results)
    resultw = ""
    for res in results:
        if res == subject :
            resultw += "1-"
        else:
            resultw += "0-"
    return im_

@app.route('/testAnswer', methods=['GET'])
def testAnswer():
    answer = request.args.get('answer')
    times = request.args.get('times')
    type_ = request.args.get('type')
    if answer==resultw+"" and Evaluate_times(times,type_):
        return "OK" 
    else:
        return "False"

@app.route('/testSoft', methods=['GET'])
def testSoft():
    times = request.args.get('time')
    if Evaluate_times(times,'soft'):
        return "OK" 
    else:
        return "False"

app.run()