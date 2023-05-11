from flask import Flask, render_template
from flask_restful import Resource, Api
from flask_cors import CORS
from application import config
from application.config import LocalDevelopmentConfig
from application.models import db
import os
from os import path
from datetime import timedelta
########FOR AUTHENTICATION

from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager




app = None
api = None

def initiate_DB(app):
    
    if path.exists('/db_directory/database.sqlite3') == False:
        db.create_all()
    return True
def create_app():
    app=Flask(__name__, template_folder="templates") #creating flask object
    app.config.from_object(LocalDevelopmentConfig)


    CORS(app)
    db.init_app(app)
    api=Api(app) 
    jwt = JWTManager(app)
    # db.create_all(app=app)
    app.app_context().push()
    initiate_DB(app)
    

    return app,api


app,api=create_app()



from application.task import *
from application.api import Userapi, Listapi, Cardapi, Summaryapi, Logoutapi, Export, export_records
api.add_resource(Userapi, "/api/user/<string:name>/<string:email>/<string:passw>", "/api/user")
api.add_resource(Listapi, "/api/user/lists", "/api/user/list/<int:l_id>")
api.add_resource(Cardapi, "/api/user/<int:l_id>/card/<int:c_id>","/api/user/<int:l_id>/cards")
api.add_resource(Summaryapi, "/api/summary")
api.add_resource(Logoutapi, "/api/logout")
api.add_resource(Export, "/api/exp_dash")



ACCESS_EXPIRES = timedelta(hours=1)
app.secret_key="secret_key_123" ##to create sessions
app.config["JWT_SECRET_KEY"] = "secret_key_jwt_123"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES


# @app.route('/')

# def home():
#     return render_template('index.html')


if __name__=="__main__":

    app.run(debug=True, port=8080)


