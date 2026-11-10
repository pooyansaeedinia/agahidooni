from django.shortcuts import render
from django.views.generic import TemplateView
from django.utils import timezone

from home.models import Banner

# Create your views here.

class HomeView(TemplateView):
    template_name = "home/home.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        banners = Banner.objects.all()
        for banner in banners:
            if banner.date_added + timezone.timedelta(days=banner.duration) < timezone.now():
                banner.active = False
                banner.save()
        context['banners'] = banners.filter(active=True)
        return context