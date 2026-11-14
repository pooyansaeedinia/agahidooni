from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.


class DashboardView(TemplateView):
    template_name = 'dashboard/dashboard.html'
    

class MyAdsView(TemplateView):
    template_name = 'dashboard/my-ads.html'
    
    
class MyFavoritesView(TemplateView):
    template_name = 'dashboard/favorite.html'
    

class ProfileView(TemplateView):
    template_name = 'dashboard/profile.html'
    
    
class ChangePasswordView(TemplateView):
    template_name = 'dashboard/change_password.html'
    

class SaveAddressView(TemplateView):
    template_name = 'dashboard/saved_addresses.html'