from django.contrib import admin
from .models import GamesFeedbacks

@admin.register(GamesFeedbacks)
class FeedbacksAdmin(admin.ModelAdmin):
    readonly_fields = ('hashtag', 'badge_letter', 'author')
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.author = request.user
        return super().save_model(request, obj, form, change)