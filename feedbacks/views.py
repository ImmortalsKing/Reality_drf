from rest_framework import viewsets
from .models import GamesFeedbacks
from .serializers import FeedbacksSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.views.generic import TemplateView
from rest_framework.pagination import PageNumberPagination

User = get_user_model()

class FeedbacksApiViewsets(viewsets.ModelViewSet):
    queryset = GamesFeedbacks.objects.order_by('create_date').all()
    serializer_class = FeedbacksSerializer
    
class UsersApiViewsets(viewsets.ModelViewSet):
    queryset = User.objects.order_by('id').all()
    serializer_class = UserSerializer
    
class HomePage(TemplateView):
    template_name = 'feedbacks/feedbacks.html'