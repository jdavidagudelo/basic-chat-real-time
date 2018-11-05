from django.contrib.auth.models import AnonymousUser
from knox.models import AuthToken
from django.conf import settings
from rest_framework import authentication

AUTH_HEADER_TOKEN = getattr(settings, 'AUTH_HEADER_TOKEN', 'X-Auth-Token')


class TokenAuthentication(object):

    @staticmethod
    def get_user(request, auth_header):
        token_string = request.META.get(auth_header)
        try:
            key = AuthToken.objects.filter(digest=token_string).first()
            user = key.user
        except IndexError:
            return None
        return user

    def is_authenticated(self, request):
        """ Check if request is authenticated."""
        auth_header = ('Http-%s' % (
            AUTH_HEADER_TOKEN,)).upper().replace('-', '_')
        if auth_header not in request.META:
            return False
        user = self.get_user(request, auth_header)
        if user is None:
            request.user = AnonymousUser()
            return False
        request.user = user
        return True


class ApiTokenAuthentication(authentication.BaseAuthentication, TokenAuthentication):
    """
    Test authentication with token for django-rest-framework and
    using django-apikey
    """

    def authenticate(self, request):
        if self.is_authenticated(request):
            return request.user, None
