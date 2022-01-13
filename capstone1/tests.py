import os
from unittest import TestCase
from sqlalchemy import exc
from flask import session
from models import db, User
from forms import SignUpForm, LoginForm, DeleteForm, SearchForm
import requests
from app import app

os.environ["DATABASE_URL"] = "postgresql:///lyricly_test"


db.create_all()


class UserModelTestCase(TestCase):
    """Test user registration"""

    def setUp(self):
        # """Create test user"""
        db.drop_all()
        db.create_all()

        self.client = app.test_client()
        app.app_context()
        app.config["TESTING"] = True

    def tearDown(self):
        res = super().tearDown()
        db.session.rollback()
        return res

    def test_user_model(self):

        u = User(
            username="testuser1",
            first_name="Test",
            last_name="User",
            password="password",
        )

        db.session.add(u)
        db.session.commit()

        self.assertEqual(u.username, "testuser1")

    # def test_login(self):

    #     # with app.test_client() as client:
    #         username = "testuser"
    #         password = "password"

    #         user = User.authenticate(username, password)
    #         # res = client.post("/login", data=user, follow_redirects=True)
    #         # html = res.get_data(as_text=True)

    #     # with app.test_client() as client:

    #     #     resp = client.get("/redirect-me")

    #     # self.assertEqual(resp.status_code, 302)

    #     self.assertIn(username, session)

    def test_api_request(self):

        with app.test_client() as client:

            form = SearchForm()

            artist = form.artist.data
            title = form.title.data

            resp = client.get(
                f"https://api.lyrics.ovh/v1/{artist}/{title}",
                params={"artist": artist, "title": title},
            )

            html = resp.get_data(as_text=True)

            results = resp.json()

            for lyric in results.values():
                res = lyric

            lyrics = res.split("\n")

        self.assertEqual(resp.status_code, 200)
        self.assertIn(lyrics, html)
