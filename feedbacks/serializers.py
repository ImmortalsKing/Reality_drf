from rest_framework import serializers
from .models import GamesFeedbacks

class FeedbacksSerializer(serializers.ModelSerializer):
    class Meta:
        model = GamesFeedbacks
        fields = '__all__'