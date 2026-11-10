from django.urls import path

from .views import SignUpView, CheckEmail, UserActivationView, CheckEmailSuccessful, CheckEmailFailed, LoginView, \
CustomLogoutView, CustomPasswordReset, PasswordResetDone, PasswordResetConfirm, PasswordResetComplete

app_name = 'accounts'

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('check-email/', CheckEmail.as_view(), name='check_email'),
    path('activate/<uidb64>/<token>/', UserActivationView.as_view(), name='user_activation'),
    path('activation-successful/', CheckEmailSuccessful.as_view(), name='check_email_successful'),
    path('activation-failed/', CheckEmailFailed.as_view(), name='check_email_failed'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('password-reset/', CustomPasswordReset.as_view(), name='password_reset'),
    path('password-reset/done/', PasswordResetDone.as_view(), name='password_reset_done'),
    path('password-reset/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='password_reset_confirm'),
    path('password-reset-complete/', PasswordResetComplete.as_view(), name='password_reset_complete'),
]
