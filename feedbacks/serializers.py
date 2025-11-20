import re
from rest_framework import serializers
from .models import GamesFeedbacks
from django.contrib.auth import get_user_model

User = get_user_model()

class FeedbacksSerializer(serializers.ModelSerializer):
    author_display = serializers.SerializerMethodField()
    
    class Meta:
        model = GamesFeedbacks
        fields = [
            'id',
            'hashtag',
            'text',
            'create_date',
            'badge_letter',
            'author_display',
        ]
        
    def get_author_display(self, obj):
        author = obj.author
        if author.first_name and author.last_name:
            return f'{author.first_name} {author.last_name}'
        return author.email

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
        
class UserSerializer(serializers.ModelSerializer):
    todos = FeedbacksSerializer(read_only=True, many=True)
    
    class Meta:
        model = User
        fields = '__all__'