from django.views.generic import TemplateView

class TermsAndConditionsView(TemplateView):
    template_name = "site_content/terms_and_conditions.html"

class HowToPostAnAdView(TemplateView):
    template_name = "site_content/how_to_post_an_ad.html"

class FAQView(TemplateView):
    template_name = "site_content/faq.html"