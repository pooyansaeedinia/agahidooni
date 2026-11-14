from django.urls import path

from dashboard.views import DashboardView, MyAdsView, ProfileView, MyFavoritesView, SaveAddressView, ChangePasswordView

app_name = 'dashboard'

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('my-ads/', MyAdsView.as_view(), name='my_ads'),
    path('favorites/', MyFavoritesView.as_view(), name='favorite'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('saved-addresses/', SaveAddressView.as_view(), name='saved_addresses'),
]