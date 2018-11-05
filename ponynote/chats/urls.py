from django.conf.urls import url

from .views import ChatMessagesListCreateView
from .views import ChatMessagesDetailView


urlpatterns = [
    url("^chat_messages/$", ChatMessagesListCreateView.as_view(), name='chat_messages'),
    url("^chat_messages/(?P<pk>[a-zA-Z0-9_:.-]+)/$", ChatMessagesDetailView.as_view(), name='chat_messages_detail'),
]
