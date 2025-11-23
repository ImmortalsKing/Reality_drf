from django import forms
from django.core import validators
from django.core.exceptions import ValidationError
from django_recaptcha.fields import ReCaptchaField
from django_recaptcha.widgets import ReCaptchaV2Checkbox

class RegisterFormClass(forms.Form):
    username = forms.CharField(
        widget=forms.TextInput(attrs={
            'placeholder': "Username",
        }),
        validators=[
            validators.MaxLengthValidator(100),
        ]
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'placeholder': "Email",
        }),
        validators=[
            validators.MaxLengthValidator(100),
            validators.EmailValidator
        ]
    )
    password = forms.CharField(
        widget= forms.PasswordInput(attrs={
            'placeholder': "Password",
        }),
        validators=[
            validators.MaxLengthValidator(100),
        ]
    )
    password_confirm = forms.CharField(
        widget= forms.PasswordInput(attrs={
            'placeholder': "Password Confirm",
        }),
        validators=[
            validators.MaxLengthValidator(100),
        ]
    )
    captcha = ReCaptchaField(widget=ReCaptchaV2Checkbox)
    
    def clean_password_confirm(self):
        password = self.cleaned_data.get('password')
        password_confirm = self.cleaned_data.get('password_confirm')
        if password == password_confirm:
            return password_confirm
        raise ValidationError ('Password and Password Confirm are mismatch.')
    

class LoginFormClass(forms.Form):
    validator = forms.CharField(
        widget=forms.TextInput(attrs={
            'placeholder': "Username or Email",
        }),
        validators=[
            validators.MaxLengthValidator(100),
        ]
    )
    password = forms.CharField(
        widget= forms.PasswordInput(attrs={
            'placeholder': "Password",
        }),
        validators=[
            validators.MaxLengthValidator(100),
        ]
    )
    captcha = ReCaptchaField(widget=ReCaptchaV2Checkbox)