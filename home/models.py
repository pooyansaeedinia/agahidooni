from django.db import models


# Create your models here.


class Banner(models.Model):
    image_desktop = models.ImageField(upload_to='banners/')
    image_tablet = models.ImageField(upload_to='banners/')
    image_mobile = models.ImageField(upload_to='banners/')
    title = models.CharField(max_length=100)
    duration = models.PositiveIntegerField(help_text="مدت زمان نمایش بنر به روز", default=30)
    active = models.BooleanField(default=True)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "بنر"
        verbose_name_plural = "بنر ها"

    def __str__(self):
        return self.title
    
