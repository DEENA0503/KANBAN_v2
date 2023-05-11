from celery import Celery
from celery.schedules import crontab
from flask import current_app as app
from flask import render_template

from application.workers import celery

from flask_mail import Mail
from application.models import Users, List, Card
from datetime import datetime


import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from jinja2 import Template

from datetime import timedelta, datetime, date

import csv

################# MAKING CELERY OBJECT #######################################

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def _call_(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)

################################### SMTP ###########################################
SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_ADDRESS='kanban@gmail.com'
SENDER_PASSWORD=""

###################################INITIALIZING MAIL AND CELERY###############################################################
celery = make_celery(app)
# mail = Mail(app)
###################################### SEND EMAIL ##########################################

def send_email(to_address, subject, message, content="text", attachment=None):
        msg= MIMEMultipart()
        msg["From"]=SENDER_ADDRESS
        msg["To"]=to_address
        msg["Subject"]=subject

        msg.attach(MIMEText(message, 'html'))
        
        if attachment:
            with open(attachment,"rb") as attachment:
                #add file as application/octet-stream
                part=MIMEBase("application", "csv")
                part.set_payload(attachment.read())
            encoders.encode_base64(part) 
            part.add_header(
                "Content-Disposition", f"attachment; filename={attachment}",
            )
            msg.attach(part)

        s=smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
        s.login(SENDER_ADDRESS, SENDER_PASSWORD)
        s.send_message(msg)
        s.quit()
        return True

def format_message(template_file, data={}):
           with open(template_file) as file_:
            template= Template(file_.read())
            return template.render(data=data)
            
            
         
#################################### TASKS #####################################################################

@celery.task()
def just_say_hello():
    print("inside Task")
    print("hello " )
    return "name"
                            #------ DAILY REMINDER -----#
@celery.task()
def daily_rem():
    # users=[
    #     {"name":"raj", "email":"raj@gmail.com"},
    #     {"name":"maan","email":"maan@gmail.com"}
    # ]
    # for i in users:
    #     send_email(i["email"], subject="Hello", message="welcom to the new world")
    # return True   
    td=str(datetime.now().strftime('%Y-%m-%d %H:%M')) 
    print(td)  
    user=Users.query.all()    
    users=[]
    for u in user:
        print(u)
        users.append({"email":u.email, "name":u.name})
        # lists=List.query.filter_by(user_id=u.id_).all()
        # for l in lists:
        #     # cards=Card.query.filter_by(list_id=list.l_id).all()
        #     cards=Card.query.filter_by(list_id=l.l_id).all()
        #     print(cards)
        #     for c in cards:
        #         print(c.deadline)
        #         print(c.deadline>td)
        #         print(c.comp)
               
        #         if c.status=="pending" or c.status=="the deadline is today":
        #                     # send_email(to_address=u.email, subject="pending tasks", message="You have some pending tasks.")
        #             users.append({"email":u.email, "name":u.name})
        #             # print(u.email)
        #             break
        #     break
   
    # print(users)
    for i in users:
        print(i)
        send_email(i["email"],subject="Daily Reminder!", message="You have some pending tasks please update the status.",content="html")
    return "daily reminders sent"   

                            #------ MONTHLY REPORT ----#
@celery.task()
def monthly_rep():
    td=(datetime.now())   
    today=str(td.strftime('%Y-%m-%d'))   
    if today[5:7] == 12:
        last_date = datetime(td.year, td.month, 31)
    else:
        last_date = datetime(td.year, td.month + 1, 1) + timedelta(days=-1)
    
    last_day=last_date.strftime("%Y-%m-%d")

    last_month =str((td - timedelta(days=td.day)).replace(day=1))
    
    user=Users.query.all()   
    
    users=[]
    for u in user:

        cards_created_last_month=0
        cr=0
        total_cards_comp=0
        cards_having_deadline_this_month=0
        failed_to_comp_last_month=0
        total_tasks=0
        num=0
        t=0
        most_comp_l=""
        min_comp_l=""
        lists=List.query.filter_by(user_id=u.id_).all()
        for l in lists:
            max_l_name=l.l_name
            min_l_name=l.l_name
            max=0
            min=1000000
            tc_inlist=0
            tcc=0
            # cards=Card.query.filter_by(list_id=list.l_id).all()
            cards=Card.query.filter_by(list_id=l.l_id).all()
            for c in cards:
                tc_inlist+=1
                total_tasks+=1
                created=c.date_created                 
                if created[0:10]>last_month and created[0:10]<today: #and yr=yr         
                    cards_created_last_month+=1
                    if c.comp==True:
                        cr+=1     
                if c.comp==True:  
                    tcc+=1
                    total_cards_comp+=1  
                    d=datetime.strptime(c.d, "%Y-%m-%d %H:%M").date()
                    dc=datetime.strptime(c.date_created, "%Y-%m-%d %H:%M").date()
                    task_comp_in=d-dc
                    num+=task_comp_in.days
                    t+=1
                if c.comp==False:
                    deadl=c.deadline
                    if deadl[0:10]>=today and deadl<=last_day:
                        cards_having_deadline_this_month+=1
                    if deadl[0:10]<today and deadl[0:10]>last_month:
                        failed_to_comp_last_month+=1
                     
            maxl=tc_inlist-tcc  
            if maxl<min:
                most_comp_l=max_l_name 
            if maxl>max:
                min_comp_l=min_l_name
            

        if t==0:
            avg=-1
        else:
            avg=num/t
        
        users.append({"email":u.email, "name":u.name,"total_tasks":total_tasks, "cards_created_last_month":cards_created_last_month, "task_comp_last_month":cr, "total_cards_comp":total_cards_comp, "cards_having_deadline_this_month":cards_having_deadline_this_month, "failed_to_comp_last_month":failed_to_comp_last_month, "num":num, "avg":avg, "max_comp_l":most_comp_l, "min_comp_l":min_comp_l})

  
    for i in users:
        print(i)
        message=format_message("./templates/prog_report.html", i)
        # with open('templates/prog_report.html') as file_:
        #     template= Template(file_.read())
        #     message= template.render(data=i)
            
        send_email(i["email"],subject="Monthly Progress report.", message=message, content="html")
    return "monthly report sent"  


@celery.task()
def exp_dash(email, name, fields, dashboard):
    dat={
        "email":email,
        "name":name
    }
    filename='./static/dasboard_records.csv'

    with open(filename, 'w', newline="", encoding="utf8") as csvfile: 
    # creating a csv dict writer object 
            writer = csv.DictWriter(csvfile, fieldnames = fields) 

            writer.writeheader() 

            writer.writerows(dashboard) 

    
   
    message=format_message("./templates/export_dash.html", dat)
    
    
    send_email(email, subject="Requested file attached.", message=message, content="html", attachment=filename)
    return "exported the file "


####################################### PERIODIC TASKS ##################################################################
@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    
    #crontab(minute=0, hour=9)
    sender.add_periodic_task(10.0, daily_rem.s(), name='daily_rem') ####for testing executes every 10 sec

   #crontab(0, 13, day_of_month='1')
    sender.add_periodic_task(5.0, monthly_rep.s(), name='monthly_rep') ####for testing executes every 5 sec

    # sender.add_periodic_task(
    #     crontab(hour=7, minute=30),
    #     test.s(),
    # )
  

###################################################################################################################    


# @celery.task()
# def test(arg):
#     print(arg)     


# ==================================================== Main Route : Home Page ====================================================
@app.route('/')
def home():
    return render_template("index.html")