from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import Seller, Collector


class MultiUserJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get("user_id")
        role = validated_token.get("role")

        if not user_id or not role:
            raise AuthenticationFailed("Token inválido: falta rol o ID")

        if role == "Seller":
            user = Seller.objects.filter(id_seller=user_id).first()
        elif role == "Collector":
            user = Collector.objects.filter(id_collector=user_id).first()
        else:
            raise AuthenticationFailed("Rol inválido en el token")

        if not user:
            raise AuthenticationFailed("Usuario no encontrado")

        return user
