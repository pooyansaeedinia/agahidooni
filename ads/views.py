from django.shortcuts import render
from django.views.generic import DetailView, ListView, TemplateView

from ads.models import Ads
from .models import UserAddress

from django.db.models import Q

# Create your views here.

class AdsListView(ListView):
    model = Ads
    template_name = 'ads/ads_list.html'
    context_object_name = 'ads'
    paginate_by = 20
    ordering = ['-date_added']
    
    
    def get_queryset(self):
        qs = super().get_queryset()

        user = self.request.user
        if user.is_authenticated:
            user_address = UserAddress.objects.filter(user=user).first()
            if user_address and user_address.city:
                qs = qs.filter(city=user_address.city)

        self.q = self.request.GET.get("q", "").strip()
        if self.q:
            qs = qs.filter(
                Q(title__icontains=self.q) |
                Q(description__icontains=self.q) |
                Q(category__name__icontains=self.q)
            )
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["q"] = self.q

        params = self.request.GET.copy()
        params.pop("page", None)
        context["querystring"] = params.urlencode()
        return context
    
    
class AdDetailView(DetailView):
    model = Ads
    template_name = 'ads/ad_details.html'
    context_object_name = 'ad'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        ad = self.get_object()
        context['ad'] = ad
        # context['ads'] = Ads.objects.filter(city=ad.city).exclude(id=ad.id)[:10]
        context['ads'] = Ads.objects.filter(city=ad.city)[:10]
        return context
    
    
class PostAdView(TemplateView):
    template_name = 'ads/post-ad.html'