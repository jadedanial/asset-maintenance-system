from rest_framework import permissions
from rest_framework.exceptions import AuthenticationFailed


class IsAuthenticatedWithJWT(permissions.BasePermission):
    def has_permission(self, request, view):
        token = request.COOKIES.get("jwt_front")

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        return True
