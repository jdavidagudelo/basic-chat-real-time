from rest_framework import viewsets, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.response import Response

from knox.models import AuthToken
from chats.auth import ApiTokenAuthentication

from .serializers import (NoteSerializer, CreateUserSerializer,
                          UserSerializer, LoginUserSerializer)


class NoteViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = NoteSerializer

    def get_queryset(self):
        return self.request.user.notes.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class RegistrationAPI(CreateAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = AuthToken.objects.filter(user=user).first()
        if token is None:
            AuthToken.objects.create(user)
            token = AuthToken.objects.filter(user=user).first()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.digest
        })


class LoginAPI(CreateAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token = AuthToken.objects.filter(user=user).first()
        if token is None:
            AuthToken.objects.create(user)
            token = AuthToken.objects.filter(user=user).first()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.digest
        })


class UserAPI(RetrieveAPIView):
    authentication_classes = (SessionAuthentication, ApiTokenAuthentication)
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
