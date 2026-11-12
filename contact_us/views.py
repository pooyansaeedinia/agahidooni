import logging

from django.conf import settings
from django.contrib import messages
from django.core.mail import send_mail
from django.urls import reverse_lazy
from django.views.generic import CreateView

from .forms import ContactMessageForm
from .models import ContactMessage

logger = logging.getLogger(__name__)


class ContactUsView(CreateView):
    model = ContactMessage
    form_class = ContactMessageForm
    template_name = "contact_us/contact_us.html"
    success_url = reverse_lazy("contact_us:contact-us")

    # پر کردن اینپوت های نام و ایمیل در صورتی که کاربر لاگین کرده باشد
    def get_initial(self):
        initial = super().get_initial()

        if self.request.user.is_authenticated:
            user = self.request.user
            profile = getattr(user, 'profile', None)

            initial.update({
                "name": profile.full_name if profile else "",
                "email": user.email
            })
        return initial

    def form_valid(self, form):
        response = super().form_valid(form)

        # زمانی که کاربر فرم تماس با ما را پر کرد به او یک ایمیل ارسال میشود که مطلع شود پیامش به دست ادمین های آگهی دونی رسیده است
        try:
            send_mail(
                subject="دریافت پیام شما | آگهی‌دونی",
                message=(
                    f"سلام {self.object.name} عزیز،\n\n"
                    "پیام شما با موفقیت دریافت شد\n"
                    "تیم پشتیبانی آگهی‌دونی در اسرع وقت پیام شما را "
                    "بررسی و پیگیری خواهد کرد\n\n"
                    "از اینکه با ما در ارتباط هستید سپاسگزاریم"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.object.email],
                fail_silently=False,
            )
        except Exception:
            logger.exception("خطا در ارسال ایمیل")

        return response

    # نمایش پیام موفقیت
    def get_success_url(self):
        messages.success(
            self.request, "پیام شما با موفقیت ارسال شد")
        return reverse_lazy("contact_us:contact-us")
