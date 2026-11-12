from django.db import models

# تماس با ما
class ContactMessage(models.Model):
    name = models.CharField(max_length=150, verbose_name="نام و نام خانوادگی")
    email = models.EmailField(verbose_name="ایمیل")
    subject = models.CharField(max_length=200, verbose_name="موضوع")
    message = models.TextField(verbose_name="متن پیام")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ارسال")
    is_read = models.BooleanField(default=False, verbose_name="خوانده شده")

    class Meta:
        verbose_name = "پیام تماس با ما"
        verbose_name_plural = "پیام‌های تماس با ما"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject}"


# اطلاعات تماس
class ContactInfo(models.Model):
    address = models.TextField(blank=True, verbose_name="آدرس")
    phone = models.CharField(max_length=20, blank=True, verbose_name="شماره تلفن")
    email = models.EmailField(blank=True, verbose_name="ایمیل")
    working_hours = models.CharField(max_length=200, blank=True, verbose_name="ساعات پاسخگویی")

    class Meta:
        verbose_name = "اطلاعات تماس"
        verbose_name_plural = "اطلاعات تماس"

    def __str__(self):
        return "اطلاعات تماس آگهی‌دونی"