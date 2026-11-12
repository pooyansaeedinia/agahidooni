from django.urls import path
from .views import TermsAndConditionsView, HowToPostAnAdView, FAQView

app_name = "site_content"

urlpatterns = [
    path("how-to-post-an-ad/", HowToPostAnAdView.as_view(), name="how-to-post-an-ad"),
    path("terms/", TermsAndConditionsView.as_view(), name="terms"),
    path("faq/", FAQView.as_view(), name="faq"),
]