import re
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class GamesFeedbacks(models.Model):
    hashtag = models.CharField(
        max_length=100,
        db_index=True,
        verbose_name="Hashtag",
        blank=True,
        null=True,
        editable=False,
    )
    text = models.TextField(verbose_name="Text")
    create_date = models.DateTimeField(auto_now_add=True, verbose_name="Create Date")
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="feedbacks", verbose_name="Author"
    )
    badge_letter = models.CharField(
        max_length=5, verbose_name="Badge Letter", blank=True, null=True, editable=False
    )

    def save(self, *args, **kwargs):
        hashtags = re.findall(r"#(\w[\w'_]*)", self.text)

        if not hashtags:
            raise ValidationError(
                {"text": "You should enter at least one hashtag(#) in text."}
            )

        self.hashtag = hashtags[0]
        self.badge_letter = self.hashtag[0].upper()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Games Feedback"
        verbose_name_plural = "Games Feedbacks"

    def __str__(self):
        return f"{self.hashtag} by {self.author}"
