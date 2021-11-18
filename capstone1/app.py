from flask import Flask, redirect

from forms import SignUpForm, LoginForm
from models import db, connect_db, User, Favorite

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///capstone1"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "Intentional"

connect_db(app)
db.create_all()
