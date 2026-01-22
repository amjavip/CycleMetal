from django.test import TestCase
from rest_framework.test import APITestCase
from users.views import validate_password, SendResetEmailView
from django.core.exceptions import ValidationError
from users.views import generate_reset_url, check_pass
from users.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from datetime import timedelta, datetime
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, TokenError
from rest_framework import status


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


class TestGenerateResetURL(TestCase):
    def test_generate_reset_url_invalid_id_user(self):

        with self.assertRaises(ValidationError):
            user = User.objects.get(id="35j9ec80c1-0abcb")
            print("user", user)
            generate_reset_url(user)

    def test_generate_reset_url_non_exist_user(self):
        with self.assertRaises(ValidationError):
            user = User.objects.get(id="123e4567-e89b-12d3-a456-426655440000")
            # No existe este ID
            generate_reset_url(user)

    def test_generate_reset_url_valid_user(self):
        roles = ["admin", "collector", "seller"]
        for role in roles:
            user = User.objects.create_user(
                username=f"testuser_{role}",
                email=f"testuser_{role}@example.com",
                role=f"{role}",
                password="testpass",
            )
            reset_url, token, uid = generate_reset_url(user)

            expected_uid = urlsafe_base64_encode(force_bytes(user.pk))
            expected_token = AccessToken.for_user(user)
            print("rrr", token)
            print("rrr444", expected_token)
            expected_token.set_exp(lifetime=timedelta(minutes=15))
            AccessToken(expected_token)
            AccessToken(token)

            # Comparaciones fuertes
            self.assertEqual(uid, expected_uid)
            self.assertEqual(
                token.split("-")[0], expected_token.split("-")[0]
            )  # token es variable en cada ejecución
            self.assertTrue(reset_url.endswith(f"/changepassword/{uid}/{token}"))
            user.delete()

    def test_generate_reset_url_none_user(self):
        with self.assertRaises(AttributeError):
            generate_reset_url(None)


class TestCheckPass(TestCase):
    def check_pass_valid_user_collector(self):
        role = "collector"
        user = User.objects.create_user(
            username=f"testuser_{role}",
            email=f"testuser_{role}@example.com",
            role=f"{role}",
            password="testpass",
        )
        id = user.id
        password = "testpass"
        url, token, uid = check_pass(role, id, password)
        expected_url, expected_token, expected_uid = generate_reset_url(user)
        self.assertEqual(url, expected_url)
        self.assertEqual(token, expected_token)
        self.assertEqual(uid, expected_uid)
        self.assertTrue(url.endswith(f"/changepassword/{uid}/{token}"))


class TestSendEmailView(APITestCase):
    def send_email_valid_user_collector(self):
        role = "collector"
        email = "javierseguralozano4@gmail.com"
        # Este gmail si existe por lo que no deberia de tener problema para enviar el gmail
        response = self.client.get(role, email)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.asserEqual(response.data["message"], "Correo enviado correctamente")
