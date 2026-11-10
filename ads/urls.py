from django.urls import path

from .views import AdDetailView, AdsListView, PostAdViewM, PostAdViewK

app_name = 'ads'

urlpatterns = [
    path('ads/', AdsListView.as_view(), name='ads-list'),
    path('ads/<int:pk>/', AdDetailView.as_view(), name='ad-detail'),
    path('ads/post/M', PostAdViewM.as_view(), name='post-ad-m'),
    path('ads/post/K', PostAdViewK.as_view(), name='post-ad-k')
]