from django.shortcuts import render
from django.views.generic import TemplateView
from django.utils import timezone

from ads.models import Ads, UserAddress
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
        context['featured_ads'] = Ads.objects.filter(is_active=True)
        context['urgent_ads'] = Ads.objects.filter(is_active=True, badge=True).order_by('-date_added')[:10]
        user = self.request.user
        if user.is_authenticated:
            user_city = UserAddress.objects.filter(user=user, is_default=True).first()
            if user_city:
                context['user_city'] = Ads.objects.filter(city=user_city.city, is_active=True)
        return context