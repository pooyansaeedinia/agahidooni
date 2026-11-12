from django import forms

from .models import ContactMessage


# فرم تماس با ما
class ContactMessageForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message", ]

        widgets = {
            "name": forms.TextInput(attrs={
                "placeholder": "نام خود را وارد کنید",
            }),

            "email": forms.EmailInput(attrs={
                "placeholder": "example@email.com",
            }),

            "subject": forms.TextInput(attrs={
                "placeholder": "موضوع پیام شما",
            }),

            "message": forms.Textarea(attrs={
                "placeholder": "پیام خود را بنویسید...",
                "rows": 5,
            }),
        }

        labels = {
            "name": "نام و نام خانوادگی",
            "email": "ایمیل",
            "subject": "موضوع",
            "message": "متن پیام",
        }
