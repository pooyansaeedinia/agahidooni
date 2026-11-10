from django.urls import path
from .views import AdDetailView, AdsListView, PostAdView

app_name = 'ads'

urlpatterns = [
    path('ads/', AdsListView.as_view(), name='ads-list'),
    path('ads/<int:pk>/', AdDetailView.as_view(), name='ad-detail'),
    path('ads/post/', PostAdView.as_view(), name='post-ad')
]