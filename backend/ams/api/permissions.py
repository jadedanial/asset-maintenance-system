from rest_framework import permissions
from rest_framework.exceptions import AuthenticationFailed
import jwt


class IsAuthenticatedWithJWT(permissions.BasePermission):
    def has_permission(self, request, view):
        token = request.COOKIES.get("jwt")

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        return True
