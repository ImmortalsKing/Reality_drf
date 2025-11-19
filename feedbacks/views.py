from rest_framework import viewsets
from .models import GamesFeedbacks
from .serializers import FeedbacksSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.views.generic import TemplateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class FeedbacksApiViewsets(viewsets.ModelViewSet):
    queryset = GamesFeedbacks.objects.order_by('create_date').all()
    serializer_class = FeedbacksSerializer
    # permission_classes = [IsAuthenticated]
    
class UsersApiViewsets(viewsets.ModelViewSet):
    queryset = User.objects.order_by('id').all()
    serializer_class = UserSerializer

class HomePage(TemplateView):
    template_name = 'feedbacks/feedbacks.html'