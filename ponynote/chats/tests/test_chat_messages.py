from django.test import TransactionTestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status

from ..models import ChatMessage


class TestChatMessages(TransactionTestCase):
    def setUp(self):
        self.user = get_user_model().objects.create(username='user1')

    def tearDown(self):
        ChatMessage.objects.all().delete()
        get_user_model().objects.all().delete()

    def test_list_chat_messages(self):
        password = 'password'
        self.user.set_password(password)
        self.user.save()
        values_count = 10
        self.client.login(username=self.user.username, password=password)
        receiver = get_user_model().objects.create(username='receiver')
        for _ in range(values_count):
            ChatMessage.objects.create(text='text', sender=self.user, receiver=receiver)
        response = self.client.get('{0}?page_size={1}&page={2}'.format(reverse('chat_messages'), 5, 1))
        self.assertEqual(response.json().get('count'), values_count)
        self.assertEqual(len(response.json().get('results')), values_count)

    def test_create_chat_message(self):
        password = 'password'
        self.user.set_password(password)
        self.user.save()
        receiver = get_user_model().objects.create(username='receiver')
        self.client.login(username=self.user.username, password=password)
        message = 'test message'
        response = self.client.post(
            reverse('chat_messages'),
            data={'text': message, 'receiver': {'id': receiver.id}}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('text'), message)
        result = ChatMessage.objects.get_all_messages(self.user)
        self.assertEqual(result.count(), 1)
        result = ChatMessage.objects.get_all_messages(receiver)
        self.assertEqual(result.count(), 1)
