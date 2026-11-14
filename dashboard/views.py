from django.shortcuts import render
from django.views.generic import TemplateView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from ads.models import Ads

# Create your views here.


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.request.user
        return context
    

class MyAdsView(LoginRequiredMixin, ListView):
    template_name = 'dashboard/my-ads.html'
    model = Ads
    context_object_name = "ads"
    
    def get_queryset(self):
        return (
            Ads.objects.filter(user=self.request.user)
            .select_related("city", "category")
            .prefetch_related("images")
            )
    
    
class MyFavoritesView(LoginRequiredMixin, ListView):
    template_name = 'dashboard/favorite.html'
    model = Ads
    context_object_name = "ads"

    def get_queryset(self):
        return (
            Ads.objects.filter(favorited_by__user=self.request.user)
            .select_related("city", "category")
            .prefetch_related("images")
            .order_by("-favorited_by__created_at")
            )
    

class ProfileView(TemplateView):
    template_name = 'dashboard/profile.html'
    
    
class ChangePasswordView(TemplateView):
    template_name = 'dashboard/change_password.html'
    

class SaveAddressView(TemplateView):
    template_name = 'dashboard/saved_addresses.html'