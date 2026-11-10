
from unicodedata import category

from django.contrib import admin

from ads.models import Ads, AdsGallery, Category, City, Province

# Register your models here.

admin.site.register(Ads)
admin.site.register(City)
admin.site.register(Province)
admin.site.register(Category)
admin.site.register(AdsGallery)