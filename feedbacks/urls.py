from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

feedbacks_routers = DefaultRouter()
feedbacks_routers.register('', views.FeedbacksApiViewsets)

urlpatterns = [
    path('feed_viewsets/', include(feedbacks_routers.urls)),
]