from operator import contains
from flask_restful import Resource, abort
from flask_restful import fields, marshal_with
from flask_restful import reqparse
import json
import datetime
# from werkzeug.exceptions import HTTPException
from flask import make_response, session
from flask import send_from_directory

from datetime import datetime
from application.models import Users, List, Card
from .models import db
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use('AGG')

from application.task import *


import hashlib

from flask import current_app as app




from flask import jsonify
from flask import request
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_header
from flask_caching import Cache

config = {
    
    "CACHE_TYPE": "redis",  # Flask-Caching related configs
    "CACHE_REDIS_HOST":"localhost",
    "CACHE_REDIS_PORT":6379,
    "CACHE_REDIS_URL":"redis://localhost:6379",
    "CACHE_DEFAULT_TIMEOUT": 10000,
    "CACHE_REDIS_DB":0
            # some Flask specific configs
}
app.config.from_mapping(config)
cache = Cache(app)



#*********************************************  PARSERS************************************************************
create_user_parser=reqparse.RequestParser()
create_user_parser.add_argument('user_name')
create_user_parser.add_argument('email')
create_user_parser.add_argument('password')


create_list_parser=reqparse.RequestParser()
create_list_parser.add_argument('l_name')
create_list_parser.add_argument('dsp')
create_list_parser.add_argument('move_to_list')


create_card_parser=reqparse.RequestParser()
create_card_parser.add_argument('c_name')
create_card_parser.add_argument('cont')
create_card_parser.add_argument('comp')
create_card_parser.add_argument('list_id')
create_card_parser.add_argument('deadline')

#************************************************** USER API **********************************************************

class Userapi(Resource):
   
    @cache.cached(timeout=0)
    def get(self, name,email,passw):
            # print(passw)
            # print(email)
            h = hashlib.md5(passw.encode()) # HASHING
            # print(h)
            p=h.hexdigest()
           
            if "@" not in email or "." not in email:
                abort (400, message="Invalid email")

            if len(passw)<6 or len(passw)>25 or passw is None:
                abort(400, message="Invalid password, minimum 6 character password required.")   
            if name is None or len(name)<1 or len(name)>25:
                abort(400, message="Invalid User name")
            if name[0]==" ":
                abort(http_status_code=400, message="Invalid User name")
            if email is None or len(email)<1 or len(email)>25:
                abort(400, message="email id is required")
             
            if " " in passw:
                abort(400, message="Invalid password, minimum 6 character password required.")   

            if passw is None:
                # print(passw)
                abort(400, message="Password required")    


            found_usr=Users.query.filter_by(name=name, email=email, passw=p).first()
            
            if found_usr:
                session["name"]=found_usr.name
                session["email"]=found_usr.email
                session["id_"]=found_usr.id_


                h=str(found_usr.id_)+str(passw)+"123"
                
                access_token=None
                access_token = create_access_token(identity=h)
                u={
                    "id":access_token
                }
                # print(access_token, h)
                return u, 200 
                
            else:
                    abort(400, message="You are not a registered user please signup!")      
            

 

    def post(self):
        
            args=create_user_parser.parse_args()
            user_name=args.get('user_name', None)
            email=args.get('email', None)
            password=args.get('password', None)
        
            if user_name is None or len(user_name)<1 or len(user_name)>25:
                abort(400, message="Invalid User name")
            if user_name[0]==" ":
                abort(http_status_code=400, message="Invalid User name")
            if email is None or len(email)<1 or len(email)>25:
                abort(400, message="email id is required")

            if password is None:
                abort(400, message="Password required")    

            if "@" not in email or "." not in email:
                abort (400, message="Invalid email")
            if " " in email:
                abort(400, message="Invalid email")
            if len(password)<6 or len(password)>25:
                abort(400, message="Invalid password, minimum 6 character password required.") 
            if " " in password:
                abort(400, message="Invalid password, minimum 6 character password required.") 
            f=Users.query.filter_by(email=email).first()
            if f:
                abort(409, message="email id is not unique")

            h = hashlib.md5(password.encode())
            # print(h)
            # print(h.hexdigest())

            u=Users(name=user_name,email=email,passw=h.hexdigest())    
            db.session.add(u)
            db.session.commit()
            session["name"]=u.name
            session["email"]=u.email
            session["id_"]=u.id_


            h=str(u.id_)+str(password)+"123"
            
            access_token=None
            access_token = create_access_token(identity=h)

            u={
                    "id":access_token
                }

        
            us=Users.query.filter_by(name=user_name,email=email,passw=password).first()
          
            
            return u, 201 
        

#*******************************LIST API*****************************************************************

class Listapi(Resource):
   
    @jwt_required()
    @cache.cached(timeout=1)
    def get(self): 
            print("TESTING")
            
            u_id=session["id_"]
            
            obj=dict()
            

            found_usr=Users.query.filter_by(id_=u_id).first()
            found_li=List.query.filter_by(user_id=u_id).all()
          
            if not found_usr:
                abort(http_status_code=404)

            for i in found_li:
                j=i.l_id
                obj[j]=[]
                obj[j].append(i.l_id)
                obj[j].append(i.l_name)
                obj[j].append(i.dsp)
                # today=str(datetime.now().strftime('%Y-%m-%d %H:%M'))   
                # obj[j].append(today)
                c=Card.query.filter_by(list_id=i.l_id).all()
                cl=[]
                for car in c:

                    dl=car.deadline.replace("T"," ")
                    td=str(datetime.now().strftime('%Y-%m-%d %H:%M'))   
                    # print(td[0:11])
                    if car.comp==True:
                        if dl>=td:
                            car.status="completed"
                        else:
                            car.status="successfully submitted"
                            car.disabled=True
                    else:
                        
                        # print(dl[0:11]==td[0:11])
                        
                        if dl<td:
                            car.status="failed to submit"
                            car.disabled=True
                        elif dl[0:11]==td[0:11]:
                            car.status="the deadline is today" 
                        elif dl>td:
                            car.status="pending"
                        
                        

                    cd={
                        "l_name":i.l_name,
                        "dsp":i.dsp,
                        "c_id":car.c_id,
                        "c_name":car.c_name,
                        "cont":car.cont,
                        "comp":car.comp,
                        "deadline":dl,
                        "d":car.d,
                        "status":car.status,
                        "disabled":car.disabled,
                        "td":td

                    }
                    cl.append(cd)
                obj[j].append(cl)
                
 
   
            return obj, 200
 

             
    @jwt_required()
    def post(self):
        
            args=create_list_parser.parse_args()
            l_name=args.get('l_name', None)
            dsp=args.get('dsp', None)

            u_id=session["id_"]
            

            if l_name is None or len(l_name)<1 or len(l_name)>20:
                abort(http_status_code=400, message="Invalid List name.")
            if l_name[0]==" ":
                abort(http_status_code=400, message="Invalid List name.") 
            if len(dsp)>45:
                abort(http_status_code=400, message="Invalid description.")       
            u=Users.query.filter_by(id_=u_id).first()
            if u:
                li=List(user_id=u_id,l_name=l_name,dsp=dsp)

                db.session.add(li)
                db.session.commit()
                name=session["name"]
                email=session["email"]
                

                found_usr=Users.query.filter_by(id_=u_id).first()
                lis=List.query.filter_by(user_id=u_id).all()
            
                if found_usr:
                    if lis:
                                             
                        return  201
                    else:
                        abort(http_status_code=404)
                else:
                    abort(http_status_code=404)     
            else:
                abort(http_status_code=404)                                     
            
    @jwt_required()
    def delete(self,l_id):
            name=session["name"]
            email=session["email"]
            u_id=session["id_"]

            args=create_list_parser.parse_args()
            move_cads_to_l_id=args.get('move_to_list', None)

            if int(move_cads_to_l_id)>0:
                c=Card.query.filter_by(list_id=l_id).all()
                for i in c:
                    i.list_id=move_cads_to_l_id
                    db.session.commit()

            
            u=Users.query.filter_by(id_=u_id).first()
            l=List.query.filter_by(l_id=l_id,user_id=u_id).first()
            if u:
                if l:
                    db.session.delete(l)
                    db.session.commit()
                    current_user = get_jwt_identity()
                    return 200

                else:
                    abort(http_status_code=404)
            else:
                abort(http_status_code=404)
        

    @jwt_required()
    def put(self,l_id):

            u_id=session["id_"]
        
            args=create_list_parser.parse_args()
            l_name=args.get('l_name', None)
            dsp=args.get('dsp', None)

            
            if l_name is None or len(l_name)<1 or len(l_name)>20:
                abort(http_status_code=400, message="Invalid List name.")
            if l_name[0]==" ":
                abort(http_status_code=400, message="Invalid List name.")
            if len(dsp)>45:
                abort(http_status_code=400, message="Invalid description.")       
            u=Users.query.filter_by(id_=u_id).first()
            li=List.query.filter_by(l_id=l_id,user_id=u_id).first()
            if u:
                if li:
                    li.l_name=l_name
                    li.dsp=dsp
                
                    db.session.commit()
                    l=List.query.filter_by(l_id=l_id,user_id=u_id).first()
                    # current_user = get_jwt_identity()
                    
                    return 200
                else:
                    abort(http_status_code=404)           
                     
            else:
                abort(http_status_code=404)                                     
          

#********************************************* CARD API ********************************************************************
class Cardapi(Resource):
    @jwt_required()
    @cache.cached(timeout=1)
    def get(self,l_id,c_id):
       
            user_id =session["id_"]

            found_usr=Users.query.filter_by(id_=user_id).first()
            found_li=List.query.filter_by(l_id=l_id,user_id=user_id).first()
            found_cr=Card.query.filter_by(list_id=l_id).all()
            cr=Card.query.filter_by(c_id=c_id,list_id=l_id).first()
            
            if found_usr:
                if found_li:
                    if found_cr:
                        cards=[]
                        cards.append(cr.c_id)       #0
                        cards.append(cr.c_name)     #1
                        cards.append(cr.cont)       #2
                        cards.append(cr.comp)       #3
                        cards.append(cr.status)     #4
                        cards.append(cr.deadline.replace("T"," "))   #5
                        cards.append(cr.list_id)    #6
                        car=[]                      #7
                        for i in found_cr:
                            td=str(datetime.now().strftime('%Y-%m-%d %H:%M'))   
                            if i.comp:
                                if i.deadline>=td:
                                    i.status="completed"
                                else:
                                    i.status="successfully submitted"
                            else:
                                if i.deadline[0:11]==td[0:11]:
                                    i.status="the deadline is today" 
                                elif i.deadline<td:
                                    i.status="failed to submit"
                                elif i.deadline>td:
                                    i.status="pending"
                                
                            c={
                                "card_id":i.c_id,
                                "card_name":i.c_name,
                                "content":i.cont,
                                "comp":i.comp,
                                "status":i.status,
                                "deadline":i.deadline,
                                "list_id":i.list_id,
                                "l_name":found_li.l_name,
                                

                            }
                            car.append(c)
                        cards.append(car)  
                        # cards.append(td)  
                        # current_user = get_jwt_identity()
    
                        return cards, 200
                    else:
                        abort(http_status_code=404)    
                else:
                    abort(http_status_code=404)    
            else:
                abort(http_status_code=404)
   

    @jwt_required()
    def post(self,l_id):
        
            args=create_card_parser.parse_args()
            c_name=args.get('c_name', None)
            cont=args.get('cont', None)
            comp=args.get('comp', None)
            deadline=args.get('deadline', None)
            
            if deadline is not None:
                d=deadline.replace("T"," ")
           
           
            if comp=="True":
                completed=True
            if comp=="False":
                completed=False 


            print(type(comp))
            user_id =session["id_"]             ########### SESSION
            
            if c_name is None or len(c_name)<1 or len(c_name)>20:
                abort(http_status_code=400, message="Invalid Card name.")
        
            if c_name[0]==" ":
                abort(http_status_code=400, message="Invalid Card name.")        
   
            
            u=Users.query.filter_by(id_=user_id).first()
            
            li=List.query.filter_by(l_id=l_id,user_id=user_id).first()

            # fmt = '%Y-%m-%d %H:%M'
            td=str(datetime.now().strftime('%Y-%m-%d %H:%M'))   
            dis=False
            stat="pending"        
            dc=None
            if completed:
                # dc=str(datetime.now())
                if deadline>=td:
                    stat="completed"
                else:
                    stat="successfully submitted"
                    dis=True
            else:
                if d[0:11]==td[0:11]:
                    stat="the deadline is today" 
                elif deadline<td:
                    stat="failed to submit"
                    dis=True
                elif deadline>td:
                    stat="pending"
                
            print(completed)        

            if u:
                if li:
                    c=Card(c_name=c_name,cont=cont,comp=completed,deadline=d,list_id=l_id,d=td,status=stat,disabled=dis)          
            

                    db.session.add(c)
                    db.session.commit()
                    # current_user = get_jwt_identity()
                    return  201
                   
                else:
                    abort(http_status_code=404)    
            else:
                abort(http_status_code=404)

    @jwt_required()
    def delete(self,l_id,c_id):
        
            user_id =session["id_"]

            u=Users.query.filter_by(id_=user_id).first()
            l=List.query.filter_by(l_id=l_id,user_id=user_id).first()
            c=Card.query.filter_by(c_id=c_id,list_id=l_id).first()
            if u:
                if l:
                    
                    if c:
                        db.session.delete(c)
                        db.session.commit()
                        # current_user = get_jwt_identity()
                        return  200
                        
                    else:
                        abort(http_status_code=404)

                else:
                    abort(http_status_code=404)
            else:
                abort(http_status_code=404)
        


   
    @jwt_required()
    def put(self,l_id,c_id):

            user_id =session["id_"]

            args=create_card_parser.parse_args()
            c_name=args.get('c_name', None)
            cont=args.get('cont', None)
            comp=args.get('comp', None)
            deadline=args.get('deadline', None)
            lis_id=args.get('list_id', None)

            if deadline is not None:
                d=deadline.replace("T"," ")
            print(deadline)
            completed=False
            if comp=="True":
                completed=True
            
            print(completed)     


            if c_name is None or len(c_name)<1 or len(c_name)>20:
                abort(http_status_code=400, message="Invalid Card name.")
            if c_name[0]==" ":
                abort(http_status_code=400, message="Invalid Card name.") 
            if len(cont)>50:
                abort(http_status_code=400, message="Invalid content.")   
  
           
            dis=False
            td=str(datetime.now().strftime('%Y-%m-%d %H:%M'))   
            if completed:
                
                if d>=td:
                    stat="completed"
                else:
                    stat="successfully submitted"
                    dis=True
            else:
                
                if d<td:
                    stat="failed to submit"
                    dis=True
                elif d[0:11]==td[0:11]:
                    stat="the deadline is today"     
                elif d>td:
                    stat="pending"
                            

            u=Users.query.filter_by(id_=user_id).first()           
            li=List.query.filter_by(l_id=l_id,user_id=user_id).first()
            c=Card.query.filter_by(c_id=c_id,list_id=l_id).first()
            ca=Card.query.filter_by(c_id=c_id,list_id=l_id).all()
          

            if u:
                if li:
                    if c:  
                        if str(l_id)!=str(lis_id):
                        #     c.list_id=lis_id
                        # else:
                            c.list_id=lis_id    

                            db.session.commit()
                            current_user = get_jwt_identity()
                            return 200
                     
                        
                        if completed:
                            c.d=str(datetime.now().strftime('%Y-%m-%d %H:%M'))   
                                        
                        c.c_name=c_name
                        c.cont=cont
                        c.status=stat
                        c.comp=completed
                        c.deadline=deadline.replace("T"," ")  
                        c.list_id=l_id
                        c.disabled=dis         
                        db.session.commit()
                        # ca=Card.query.filter_by(c_id=c_id,list_id=l_id).first()
                        current_user = get_jwt_identity()
                        return  200
                       
                    else:
                        abort(http_status_code=404)    
                else:
                    abort(http_status_code=404)           
                     
            else:
                abort(http_status_code=404)                                     
          
#*************************************************** SUMMARY *********************************************
class Summaryapi(Resource):
    @jwt_required()
    @cache.cached(timeout=1)
    def get(self):

        user_id =session["id_"]
        
        u=Users.query.filter_by(id_=user_id).first()
        lis=List.query.filter_by(user_id=user_id).all()

        #k=dict()
        if u:
            if lis:
                z=[]
                for l in lis:
                    pl=l.l_id
                    n=l.l_name
                    #k[pl]=[]
                    #k[pl].append(n)
                    datess=[]
                    crdss=[]
                    trdl={}
                    car=Card.query.filter_by(list_id=l.l_id).all()
                    t=0
                    s=0
                    p=0
                    c=0
                    f=0
                    if car:
                        for cr in car:
                            if str(cr.d[0:11]) not in trdl.keys():
                                trdl[cr.d[0:11]]=0                           
                           
                            if cr:
                                ddl=cr.deadline.replace("T"," ")
                                td=str(datetime.now().strftime('%Y-%m-%d %H:%M'))   
                                # print(ddl, td, cr.comp)
                                t+=1
                                if ddl<td and cr.comp==False:
                                    f+=1
                                    
                                elif ddl>=td and cr.comp==False:
                                    p+=1
                                elif ddl<td and cr.comp==True:
                                    s+=1.
                                    
                                    datess.append(cr.d[0:11])
                                    # print(cr.name)
                                    # print("comp")
                                    crdss.append(cr.c_name)
                                    trdl[cr.d[0:11]]+=1
                                    
                                elif ddl>=td and cr.comp==True:
                                    c+=1
                                    datess.append(cr.d[0:11])
                                    crdss.append(cr.c_name)
                                    # print(cr.c_name)
                                    trdl[cr.d[0:11]]+=1
 

                            else:
                                continue     
                    else:
                        ob2={
                            "list_id":pl,
                            "list_name":n,
                            "total_cards":0,
                            "cards_that_crossed_deadline":0,
                            "completed":c,
                            "successfully_submitted":0,
                            "pending":0,
                            "failed_to_submit":0

                            }
                        z.append(ob2)  
                        y = [s, f, p, c]
                        
                        mylabels = ["succes", "failed to submit", "pending", "completed"]
                        ci=["#a2f9aa", "#880e4f", "#f50057", "#4CAF50"]
                        plt.bar(mylabels,y, width=0.4,color=ci)
           
                        plt.title(n)
                        plt.xlabel("status")
                        plt.ylabel(f"no. of tasks out of total {t}")
                        plt.savefig(f"static/{pl}.png", dpi=80)
                        # plt.title('{n}')
                        plt.clf()    

                        
                        plt.title(n)
                        plt.xlabel("Dates")
                        plt.ylabel(f"Number of cards completed.")
                        plt.scatter(trdl.keys(), trdl.values())
                        fr="static/td"+str(pl)+".png"
                        plt.savefig(fr, dpi=80)
                        plt.clf()    
                        continue
                    
                    #complet=s+c   
                    #incomp=f+p
                    crosd=s+f
                
                    ob={
                        "list_id":pl,
                        "list_name":n,
                        "total_cards":t,
                        "cards_that_crossed_deadline":crosd,
                        "completed":c,
                        "successfully_submitted":s,
                        "pending":p,
                        "failed_to_submit":f
                    }
                    z.append(ob)

                    y = [s, f, p, c]
                    mylabels = ["succes", "failed to submit", "pending", "completed"]
                    ci=["#a2f9aa", "#880e4f", "#f50057", "#4CAF50"]
                    plt.bar(mylabels,y, width=0.4,color=ci)
           
                    plt.title(n)
                    plt.xlabel("status")
                    plt.ylabel(f"no. of tasks out of total {t}")
                    plt.savefig(f"static/{pl}.png", dpi=80)
                    plt.clf()   
                    plt.title(n)

                    ty=datess
                    tx=crdss
                    # print(crdss,datess)
                    print(trdl)
                    
                    # plt.plot(crdss, datess)
                    # plt.title("scatter chart")
                    plt.title(n)
                    plt.xlabel("Dates")
                    plt.ylabel(f"Number of cards completed.")
                    plt.scatter(trdl.keys(), trdl.values())
                    fr="static/td"+str(pl)+".png"
                    plt.savefig(fr, dpi=80)
                    plt.clf()    
                
                return z, 200
            else:
                abort(http_status_code=404)
        else:
            abort(http_status_code=404)

################################################## LOGOUT #################################################################

class Logoutapi(Resource):
    # @jwt_required()
    def post(self):
        session.pop("name", None)
        session.pop("email", None)##
        session.pop("id_", None)##
        cache.clear()
        # current_user = get_jwt_identity()
        return 200



########################################################### EXPORT API ####################

class Export(Resource):
    @jwt_required()
    def get(self):
        user_id =session["id_"]
        user=Users.query.filter_by(id_=user_id).first()
        fields=["list_name", "list_description", "card_name", "card_content","status", "deadline"]
        dashboard=[]
        lists=List.query.filter_by(user_id=user_id).all()
        for l in lists:
            cards=Card.query.filter_by(list_id=l.l_id).all()
            for c in cards:
                dashboard.append({"list_name":l.l_name, "list_description":l.dsp, "card_name":c.c_name, "card_content":c.cont, "deadline":c.deadline})


        filename="./static/dasboard_records.csv"

        with open(filename, 'w', newline="", encoding="utf8") as csvfile: 
    # creating a csv dict writer object 
            writer = csv.DictWriter(csvfile, fieldnames = fields) 

            writer.writeheader() 

            writer.writerows(dashboard) 

        
        job=exp_dash.delay(user.email, user.name,fields, dashboard)
        # jo=job.wait()
        return 200
    
@jwt_required()
@app.route("/export_records", methods=["GET"])
def export_records():
    
    user_id =session["id_"]
    user=Users.query.filter_by(id_=user_id).first()
    print(user)
    fields=["list_name", "list_description", "card_name", "card_content","status", "deadline"]
    dashboard=[]
    lists=List.query.filter_by(user_id=user_id).all()
    print(lists)
    for l in lists:
        cards=Card.query.filter_by(list_id=l.l_id).all()
        print(cards)
        for c in cards:
            dashboard.append({"list_name":l.l_name, "list_description":l.dsp, "card_name":c.c_name, "card_content":c.cont,"status":c.status, "deadline":c.deadline})


    # filename="./static/dboard_records.csv"

#     with open(filename, 'w', newline="", encoding="utf8") as csvfile: 
# # creating a csv dict writer object 
#         writer = csv.DictWriter(csvfile, fieldnames = fields) 

#         writer.writeheader() 

#         writer.writerows(dashboard) 
#         print(dashboard)
    job=exp_dash.delay(user.email, user.name,fields, dashboard)
    job.wait()
    return send_from_directory("static", "dasboard_records.csv"),200

        
#############################################################################################################################




                    



# @app.route('/eheboy')
# @cache.cached(timeout=55)
# def testingcache():
#     time.sleep(10)
#     return "cached the content"