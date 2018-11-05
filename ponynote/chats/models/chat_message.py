from django.db import models
from django.db.models import Q
from django.contrib.auth import get_user_model


class ChatMessageManager(models.Manager):
    def get_all_messages(self, user):
        return self.filter(Q(sender=user) | Q(receiver=user)).order_by('-created_at')


class ChatMessage(models.Model):
    text = models.CharField(max_length=10000)
    sender = models.ForeignKey(get_user_model(), related_name="sent_messages", on_delete=models.CASCADE,
                               null=True, db_index=True)
    receiver = models.ForeignKey(get_user_model(), related_name='received_messages', on_delete=models.CASCADE,
                                 null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    objects = ChatMessageManager()

    def __str__(self):
        return self.text
