from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class GamesFeedbacks(models.Model):
    hashtag = models.CharField(max_length=100, db_index=True, verbose_name="Hashtag")
    text = models.TextField(verbose_name="Text")
    up_vote_count = models.IntegerField(max_length=10, verbose_name="UpVote Count")
    create_date = models.DateTimeField(auto_now_add=True, verbose_name="Create Date")
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Author")
    badge_letter = models.CharField(
        max_length=5, verbose_name="Badge Letter"
    )
    
    class Meta:
        verbose_name = "Games Feedback"
        verbose_name_plural = "Games Feedbacks"
        
    def __str__(self):
        return f"{self.hashtag} by {self.author}"