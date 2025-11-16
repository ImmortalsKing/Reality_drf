from rest_framework import viewsets
from .models import GamesFeedbacks
from .serializers import FeedbacksSerializer

class FeedbacksApiViewsets(viewsets.ModelViewSet):
    model = GamesFeedbacks
    serializer_class = FeedbacksSerializer