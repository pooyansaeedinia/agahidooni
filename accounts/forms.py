from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.core.exceptions import ValidationError

from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ("email",)
        widgets = {
            "email": forms.EmailInput(attrs={
                "placeholder": "ایمیل خود را وارد کنید",
                "autocomplete": "email",
            }),
        }
        labels = {
            "email": "ایمیل",
        }

    def clean_email(self):
        email = self.cleaned_data["email"].strip().lower()

        if CustomUser.objects.filter(email__iexact=email).exists():
            raise ValidationError("این ایمیل قبلا ثبت شده است")

        return email


class CustomAuthenticationForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["username"].label = "ایمیل"
        self.fields["username"].widget = forms.EmailInput(attrs={
            "placeholder": "ایمیل خود را وارد کنید",
            "autocomplete": "email",
            "autofocus": True,
        })

        self.fields["password"].label = "رمز عبور"
        self.fields["password"].widget = forms.PasswordInput(attrs={
            "placeholder": "رمز عبور خود را وارد کنید",
            "autocomplete": "current-password",
        })