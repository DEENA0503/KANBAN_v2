from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
#from sqlalchemy.sql import func
from flask_sqlalchemy import SQLAlchemy
from datetime import date, datetime
db = SQLAlchemy()

class Users(db.Model):
    __tablename__='users'
    id_=Column(Integer, primary_key=True, autoincrement = True)
    name=Column(String(25), nullable = False)
    email=Column(String(25),nullable = False,unique=True)
    passw=Column(String(25),nullable = False)##
    lists=relationship("List", backref="user", cascade="all, delete-orphan") #backref is implicit
    
    
  
class List(db.Model):
    __tablename__='list'
    l_id=Column(Integer, primary_key=True)
    user_id=Column(Integer, ForeignKey("users.id_"))
    l_name=Column(String(20), nullable = False)
    dsp=Column(String(45))
    cards=relationship("Card", backref="li", cascade="all, delete-orphan")

    
 
class Card(db.Model):
    __tablename__='card'
    c_id=Column(Integer, primary_key=True, autoincrement = True)
    c_name=Column(String(20), nullable = False)
    cont=Column(String(50))
    comp=Column(Boolean, default=False)
    # deadline=Column(String(10), nullable=False )
    deadline=Column(String, nullable=False )
    list_id=Column(Integer, ForeignKey("list.l_id"))
    d=Column(String)
    status=Column(String)
    disabled=Column(Boolean, nullable=False, default=False)
    date_created=Column(String(16), default=datetime.now().strftime('%Y-%m-%d %H:%M'))
    