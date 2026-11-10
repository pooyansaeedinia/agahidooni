from django.contrib.auth.models import UserManager, AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import Model


# ساخت کاربر با استفاده از شماره موبایل بدون نیاز به username
class CustomUserManager(UserManager):

    def _create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("ایمیل الزامی است")

        email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("سوپریوزر باید is_staff=True داشته باشد")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("سوپریوزر باید is_superuser=True داشته باشد")

        return self._create_user(email, password, **extra_fields)


# مدل کابر با استفاده از AbstractUser
class CustomUser(AbstractUser):
    # حذف فیلدهای پیش‌فرض
    username = None
    first_name = None
    last_name = None

    # استفاده از ایمیل به‌عنوان شناسه ورود
    email = models.EmailField(unique=True, verbose_name="ایمیل")
    ROLE_CHOICES = [
        ("user", "کاربر"),
        ("admin", "ادمین"),
        ("manager", "مدیر"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user", verbose_name="نقش")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        verbose_name = "کاربر"
        verbose_name_plural = "کاربران"
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email


# مدل پروفایل برای هر کاربر
class UserProfile(models.Model):
    GENDER_CHOICES = [
        ("male", "مرد"),
        ("female", "زن"),
    ]
    phone_validator = RegexValidator(regex=r"^09\d{9}$", message="شماره موبایل باید با 09 شروع شود و 11 رقم باشد")
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="profile", verbose_name="کاربر")
    first_name = models.CharField(max_length=50, blank=True, verbose_name="نام")
    last_name = models.CharField(max_length=50, blank=True, verbose_name="نام خانوادگی")
    phone = models.CharField(max_length=11, validators=[phone_validator], blank=True, verbose_name="شماره موبایل")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True, verbose_name="آواتار")
    bio = models.TextField(max_length=1000, blank=True, verbose_name="درباره من")
    birth_date = models.DateField(null=True, blank=True, verbose_name="تاریخ تولد")
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, verbose_name="جنسیت")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخرین ویرایش")

    class Meta:
        verbose_name = "پروفایل کاربر"
        verbose_name_plural = "پروفایل کاربران"

    def __str__(self):
        return f"پروفایل {self.user.email}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()



