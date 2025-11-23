from django.shortcuts import render, redirect
from django.views.generic import View
from .forms import RegisterFormClass, LoginFormClass
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth import get_user_model, login, logout
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

User = get_user_model()


class RegisterPage(View):
    def get(self, request):
        form = RegisterFormClass()
        context = {"form": form}
        return render(request, "account/register.html", context)

    def post(self, request):
        form = RegisterFormClass(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            email = form.cleaned_data.get("email")
            password = form.cleaned_data.get("password")
            user_exists = User.objects.filter(email=email).first()
            if user_exists:
                form.add_error("email", "Email is already exists.")
            else:
                new_user = User(username=username, email=email)
                new_user.set_password(password)
                new_user.save()
                messages.success(request, "You have been registered successfully.")
                login(request, new_user)
                return redirect(reverse('feedbacks_page'))
        context = {"form": form}
        return render(request, "account/register.html", context)
    

class LoginPage(View):
    def get(self,request):
        form = LoginFormClass()
        context = {"form": form}
        return render(request, "account/login.html", context)
    def post(self,request):
        form = LoginFormClass(request.POST)
        if form.is_valid():
            validator = form.cleaned_data.get("validator")
            password = form.cleaned_data.get("password")
            user_auth_by_username = User.objects.filter(username=validator).first()
            user_auth_by_email = User.objects.filter(email=validator).first()
            if user_auth_by_username and user_auth_by_username.check_password(password):
                login(request, user_auth_by_username)
                return redirect(reverse('feedbacks_page'))
            elif user_auth_by_email and user_auth_by_email.check_password(password):
                login(request, user_auth_by_email)
                return redirect(reverse('feedbacks_page'))
            else:
                messages.error(request, "Email/Username or password is incorrect.")
        context = {"form": form}
        return render(request, "account/login.html", context)
    
@method_decorator([login_required],name='dispatch')
class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect(reverse('login_page'))