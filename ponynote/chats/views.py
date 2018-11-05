from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import ListCreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveAPIView
from django.contrib.auth import get_user_model

from chats.auth import ApiTokenAuthentication
from .serializers import ChatMessageSerializer
from .models import ChatMessage


class ChatMessagesDetailView(UpdateAPIView, DestroyAPIView, RetrieveAPIView):
    authentication_classes = (SessionAuthentication, ApiTokenAuthentication)
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        return ChatMessage.objects.filter(id=self.kwargs.get('pk'))


class ChatMessagesListCreateView(ListCreateAPIView):
    authentication_classes = (SessionAuthentication, ApiTokenAuthentication)
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = ChatMessageSerializer

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_queryset(self):
        return ChatMessage.objects.get_all_messages(self.request.user)

    def perform_create(self, serializer):
        receiver = self.request.data.get('receiver')
        if receiver is not None:
            receiver = get_user_model().objects.filter(**receiver).first()
        if receiver is None:
            receiver = self.request.user
        serializer.save(sender=self.request.user, receiver=receiver)

