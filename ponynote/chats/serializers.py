from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import ChatMessage


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ('id', 'username')


class ChatMessageSerializer(serializers.ModelSerializer):

    sender = UserSerializer(required=False, read_only=True)
    receiver = UserSerializer(required=False, read_only=True)

    class Meta:
        model = ChatMessage
        fields = ('id', 'text', 'sender', 'receiver', 'created_at')
