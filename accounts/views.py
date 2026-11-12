from django.contrib import messages
from django.contrib.auth import get_user_model, login
from django.contrib.auth.views import LogoutView, PasswordResetView, PasswordResetDoneView, PasswordResetConfirmView, \
    PasswordResetCompleteView
from django.core.mail import send_mail
from django.shortcuts import redirect
from django.urls import reverse, reverse_lazy
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.generic import CreateView, TemplateView, View, FormView

from .forms import CustomUserCreationForm, CustomAuthenticationForm
from .tokens import generate_activation_token, verify_activation_token

User = get_user_model()


# کلاس زیر با استفاده از کلاس آماده CreateVeiw عملیات ثبت نام کاربر را انجام میدهد
class SignUpView(CreateView):
    model = User
    form_class = CustomUserCreationForm
    template_name = "accounts/signup.html"
    success_url = reverse_lazy("accounts:check_email")

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("home:home")

        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        user = form.save(commit=False)
        user.is_active = False
        user.save()

        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = generate_activation_token(user)

        activation_link = self.request.build_absolute_uri(
            reverse(
                "accounts:user_activation",
                args=[uidb64, token]
            )
        )

        try:
            result = send_mail(
                subject="فعال‌سازی حساب کاربری",
                message=(
                    "سلام\n\n"
                    "برای فعال‌سازی حساب کاربری خود روی لینک زیر کلیک کنید:\n\n"
                    f"{activation_link}"
                ),
                recipient_list=[user.email],
                from_email=None,
                fail_silently=False,
            )

            if result != 1:
                raise RuntimeError("ایمیل فعال‌سازی ارسال نشد")

        except Exception:
            messages.error(self.request, "ارسال ایمیل با مشکل مواجه شد. لطفا بعدا دوباره تلاش کنید")
            return redirect("accounts:signup")

        messages.success(self.request, "ایمیل فعال‌سازی با موفقیت ارسال شد")

        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "ًلطفا خطاهای فرم را برطرف کنید")
        return super().form_invalid(form)


# صفحه راهنمای بررسی ایمیل
class CheckEmail(TemplateView):
    template_name = "accounts/check_email.html"


# کلاس زیر حساب کاربری کاربر را فعال میکند
class UserActivationView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (
                TypeError,
                ValueError,
                OverflowError,
                User.DoesNotExist,
        ):
            messages.error(request, "لینک فعال‌سازی معتبر نیست")
            return redirect("accounts:check_email_failed")

        if user.is_active:
            messages.info(request, "حساب کاربری شما قبلا فعال شده است")
            return redirect("accounts:check_email_successful")

        if not verify_activation_token(user, token):
            messages.error(
                request, "لینک فعال‌سازی نامعتبر یا منقضی شده است")
            return redirect("accounts:check_email_failed")

        user.is_active = True
        user.save(update_fields=["is_active"])

        messages.success(request, "حساب کاربری شما با موفقیت فعال شد")
        return redirect("accounts:check_email_successful")


# صفحات نتیجه فعال سازی
class CheckEmailSuccessful(TemplateView):
    template_name = "accounts/check_email_successful.html"


class CheckEmailFailed(TemplateView):
    template_name = "accounts/check_email_failed.html"


# کلاس زیر عملیات ورود کاربر با استفاده از کلاس آماده FormView انجام میدهد
class LoginView(FormView):
    form_class = CustomAuthenticationForm
    template_name = "accounts/login.html"
    success_url = reverse_lazy("home:home")

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("home:home")

        return super().dispatch(request, *args, **kwargs)

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs["request"] = self.request
        return kwargs

    def form_valid(self, form):
        user = form.get_user()
        login(self.request, user)

        messages.success(self.request, "خوش آمدید")
        return redirect(self.get_success_url())


# کلاس زیر عملیات خروح کاربر را انجام میدهد با استفاده از کلاس آماده LogoutView انجام میدهد
class CustomLogoutView(LogoutView):
    next_page = reverse_lazy("accounts:login")
    http_method_names = ["post", "options"]

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            messages.success(request, "با موفقیت خارج شدید.")

        return super().dispatch(request, *args, **kwargs)


# تغییر رمز عبور با استفاده از کلاس های آماده ایی که خود جنگو در اختیار ما قرار میدهد
class CustomPasswordReset(PasswordResetView):
    template_name = "accounts/forgot_password.html"
    email_template_name = "accounts/reset_password_email.txt"
    subject_template_name = "accounts/reset_password_subject.txt"
    success_url = reverse_lazy("accounts:password_reset_done")


class PasswordResetDone(PasswordResetDoneView):
    template_name = "accounts/reset_password_check_email.html"


class PasswordResetConfirm(PasswordResetConfirmView):
    template_name = "accounts/reset_password.html"
    success_url = reverse_lazy("accounts:password_reset_complete")


class PasswordResetComplete(PasswordResetCompleteView):
    template_name = "accounts/reset_password_completed.html"