from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

feedbacks_routers = DefaultRouter()
feedbacks_routers.register('', views.FeedbacksApiViewsets)
users_routers = DefaultRouter()
users_routers.register('', views.UsersApiViewsets)

urlpatterns = [
    path('feedbacks/', include(feedbacks_routers.urls)),
    path('users/', include(users_routers.urls)),
    path('', views.HomePage.as_view(), name="feedbacks_page")
]