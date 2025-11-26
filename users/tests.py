from django.test import TestCase
from users.views import validate_password
from django.core.exceptions import ValidationError

"""Creation of tests for users view, it will be divided in functions that will test each one separately."""


class TestValidatePassword(TestCase):
    def test_password_vacia(self):
        with self.assertRaises(ValidationError):
            validate_password("")

    def test_password_starts_with(self):
        with self.assertRaises(ValidationError):
            validate_password("pbkdf2_sha256$hola")

    def test_password_null(self):
        with self.assertRaises(ValidationError):
            validate_password(None)

    def test_password_valid(self):
        self.assertEqual(validate_password("123"), "123")
