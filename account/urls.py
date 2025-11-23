from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterPage.as_view(), name="register_page"),
    path('login/', views.LoginPage.as_view(), name="login_page"),
    path('logout/',views.LogoutView.as_view(),name='logout_page'),
]