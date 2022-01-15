import os
from unittest import TestCase

from models import db, User

from app import app


os.environ["DATABASE_URL"] = "postgresql:///lyricly_test"


app.config["TESTING"] = True


class LyriclyTestCase(TestCase):
    def setUp(self):
        # """Create test user"""
        db.drop_all()
        db.create_all()

        u = User.register(
            username="testuser",
            first_name="Test",
            last_name="User",
            password="password",
        )

        db.session.add(u)
        db.session.commit()

        self.client = app.test_client()

    def tearDown(self):
        res = super().tearDown()
        db.session.rollback()
        return res

    def test_user_model(self):

        user = User(
            username="testuser1",
            first_name="Test",
            last_name="User",
            password="password",
        )

        db.session.add(user)
        db.session.commit()

        self.assertEqual(user.username, "testuser1")

    def test_lyrics_on_page(self):

        with app.test_client() as client:

            res = client.post(
                "/",
                data={"artist": "maverick city music", "title": "communion"},
                follow_redirects=True,
            )

            html = res.get_data(as_text=True)

        self.assertEqual(res.status_code, 200)
        self.assertIn("communion", html)

    def test_authorization(self):

        with app.test_client() as client:

            res = client.get("/users/username", follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertIn("Unauthorized", html)

    def test_registration(self):
        """Test user registration"""

        with app.test_client() as client:

            u = User.register(
                username="testuser1",
                first_name="Test",
                last_name="User",
                password="password",
            )

            db.session.add(u)
            db.session.commit()

            username = "testuser1"
            password = "password"

            user = User.authenticate(username, password)

            res = client.post(
                "/register",
                data={"username": "testuser1", "password": "password"},
                follow_redirects=True,
            )

            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn("testuser1", html)

    def test_login(self):
        """Test user login"""

        with app.test_client() as client:

            username = "testuser"
            password = "password"

            user = User.authenticate(username, password)

            res = client.post(
                "/login",
                data={"username": "testuser", "password": "password"},
                follow_redirects=True,
            )

            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn("testuser", html)
