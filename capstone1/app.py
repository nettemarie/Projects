import os, sys

# from flask.json import jsonify
import requests
from flask import Flask, redirect, session, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError

from forms import SignUpForm, LoginForm, DeleteForm, SearchForm
from models import db, connect_db, User
from werkzeug.exceptions import Unauthorized


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", "postgresql:///lyricly"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "Purpose")

connect_db(app)
db.create_all()


@app.route("/", methods=["GET", "POST"])
def homepage():
    """Homepage of site; search lyrics, login, or regsiter."""

    form = SearchForm()
    artist = form.artist.data
    title = form.title.data

    if form.validate_on_submit():

        if artist and title:

            resps = requests.get(f"https://api.lyrics.ovh/v1/{artist}/{title}")

            results = resps.json()

            for lyric in results.values():
                res = lyric

            lyrics = res.split("\n")

            if lyrics == "['No lyrics found']":
                noLyrics = "No lyrics found"

            return render_template(
                "search.html",
                form=form,
                artist=artist.title(),
                resps=resps,
                title=title.title(),
                lyrics=lyrics,
            )

        else:
            flash("Must enter an artist and title", "danger")
            return render_template("search.html", form=form)

    else:
        return render_template("search.html", form=form)


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register a user: produce form and handle form submission."""

    if "username" in session:
        return redirect(f"/users/{session['username']}")

    form = SignUpForm()

    if form.validate_on_submit():

        try:

            user = User.register(
                username=form.username.data,
                password=form.password.data,
                first_name=form.first_name.data,
                last_name=form.last_name.data,
            )

            db.session.commit()

            session["username"] = user.username

        except IntegrityError as e:
            flash("Username already taken", "danger")
            return render_template("register.html", form=form)

        flash(f"Hello {user.username}!", "success")
        return redirect(f"/users/{user.username}")

    else:
        return render_template("register.html", form=form)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Produce login form or handle login."""

    if "username" in session:
        return redirect(f"/users/{session['username']}")

    form = LoginForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = User.authenticate(username, password)  # <User> or False
        if user:
            session["username"] = user.username
            flash(f"Hello {user.username}!", "success")
            return redirect(f"/users/{username}")
        else:
            flash("Invalid username/password", "danger")
            return render_template("login.html", form=form)

    return render_template("login.html", form=form)


@app.route("/users/<username>", methods=["GET", "POST"])
def user(username):
    """User homepage"""

    if "username" not in session or username != session["username"]:
        raise Unauthorized()

    user = User.query.get(username)
    form = SearchForm()

    if form.validate_on_submit():
        artist = (form.artist.data).title()
        title = (form.title.data).title()

        resps = requests.get(f"https://api.lyrics.ovh/v1/{artist}/{title}")

        results = resps.json()

        for lyric in results.values():
            res = lyric

        lyrics = res.split("\n")

        return render_template(
            "search.html",
            user=user,
            form=form,
            artist=artist,
            resps=resps,
            title=title,
            lyrics=lyrics,
        )

    else:
        return render_template("search.html", form=form)


@app.route("/logout")
def logout():
    """Logout route."""

    session.pop("username")
    return redirect("/")
