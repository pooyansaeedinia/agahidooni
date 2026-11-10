from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.urls import reverse
from django.utils.text import slugify

from Agahidooni import settings


# مدل استان ها
class Province(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "استان"
        verbose_name_plural = "استان ها"
        ordering = ['name']

    def __str__(self):
        return self.name


# مدل شهر ها
class City(models.Model):
    name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name='cities')

    class Meta:
        verbose_name = "شهر"
        verbose_name_plural = "شهر ها"
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(fields=('name', 'province'), name='unique_city_per_province')
        ]

    def __str__(self):
        return f"{self.name} - {self.province.name}"
    

# مدل دسته بندی ها
class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.ImageField(upload_to='icons/', blank=True)

    class Meta:
        verbose_name = "دسته بندی"
        verbose_name_plural = "دسته بندی ها"
        ordering = ['name']

    def __str__(self):
        return self.name
    

class Brand(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "برند"
        verbose_name_plural = "برند ها"
        ordering = ['name']

    def __str__(self):
        return self.name


# مدل آگهی ها
class Ads(models.Model):
    # انتخاب نوع آگهی
    AD_TYPE_CHOICES = [
        ("product", "محصول"),
        ("service", "خدمات")
    ]
    # وضعیت محصول از لحاظ سلامت
    PRODUCT_STATUS_CHOICES = [
        ("new", "نو"),
        ("like_new", "در حد نو"),
        ("used", "کار کرده"),
        ("repair", "نیاز به تعمیر"),
    ]
    BADGE_CHOICES = [
        (True, "فوری"),
        (False, "عادی")
    ]
    city = models.ForeignKey(City, on_delete=models.PROTECT, related_name='ads')
    date_added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='ads')
    Brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name='ads', blank=True, null=True)
    price = models.PositiveIntegerField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='ads')
    ad_type = models.CharField(max_length=50, choices=AD_TYPE_CHOICES)
    product_status = models.CharField(max_length=50, choices=PRODUCT_STATUS_CHOICES, blank=True)
    slug = models.SlugField(max_length=100, blank=True, allow_unicode=True)
    badge = models.BooleanField(default=False, verbose_name="برچسب")
    
    class Meta:
        verbose_name = "آگهی"
        verbose_name_plural = "آگهی ها"
        ordering = ["-date_added"]

    # اعتبار سنجی فیلد های ad_type و product_status
    def clean(self):
        if self.ad_type == "product" and not self.product_status:
            raise ValidationError(
                {"product_status": "برای آگهی محصول ، وضعیت محصول الزامی است"}
            )
        if self.ad_type == "service" and self.product_status:
            raise ValidationError(
                {"product_status": "برای آگهی خدمات وضعیت محصول نباید تعیین شود"}
            )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True) or "ad"
        self.full_clean()
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('ads:ad-detail', kwargs={'pk': self.pk or 'ad'})


# مدل گالری عکس های محصولات
class AdsGallery(models.Model):
    image = models.ImageField(upload_to='photos/')
    ad = models.ForeignKey(Ads, on_delete=models.CASCADE, related_name='images')

    MAX_IMAGES = 10

    # اعتبار سنجی تعداد عکس های آپلود شده (اگر تعداد آنها بیشتر از ده باشد ارور میدهد)
    def save(self, *args, **kwargs):
        if not self.pk:
            if self.ad.images.count() >= self.MAX_IMAGES:
                raise ValidationError(
                    "هر آگهی حداکثر می‌تواند 10 تصویر داشته باشد"
                )
        super().save(*args, **kwargs)

    def __str__(self):
        return self.ad.title
    
    

# مدل آدرس برای آدرس های چندگانه برای هر کاربر
class UserAddress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="addresses", verbose_name="کاربر")
    title = models.CharField(max_length=50, default="خانه", verbose_name="عنوان آدرس")
    province = models.ForeignKey("ads.Province", on_delete=models.PROTECT, verbose_name="استان")
    city = models.ForeignKey("ads.City", on_delete=models.PROTECT, verbose_name="شهر")
    full_address = models.TextField(verbose_name="آدرس کامل")
    postal_code = models.CharField(max_length=10, blank=True, verbose_name="کد پستی")
    phone = models.CharField(max_length=11, blank=True, verbose_name="شماره موبایل")
    is_default = models.BooleanField(default=False, verbose_name="آدرس پیش‌فرض")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "آدرس کاربر"
        verbose_name_plural = "آدرس‌های کاربران"
        ordering = ["-is_default", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["user"],
                condition=Q(is_default=True),
                name="unique_default_address_per_user",
            )
        ]

    def __str__(self):
        return f"{self.user.email} - {self.title}"

    def save(self, *args, **kwargs):
        if self.is_default:
            UserAddress.objects.filter(
                user=self.user,
                is_default=True,
            ).exclude(pk=self.pk).update(is_default=False)

        super().save(*args, **kwargs)
