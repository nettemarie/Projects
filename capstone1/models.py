from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()


class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    username = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)
    favorites_id = db.Column(
        db.Integer, db.ForeignKey("favorites.id", ondelete="cascade")
    )


class Favorite(db.Model):

    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    artist = db.Column(db.Text, nullable=False)
    title = db.Column(db.Text, nullable=False)
    lyrics = db.Column(db.Text, nullable=False)


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)
