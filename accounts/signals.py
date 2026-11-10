from django.conf import settings
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

from .models import UserProfile


@receiver(pre_save, sender=settings.AUTH_USER_MODEL)
def track_user_activation(sender, instance, **kwargs):
    if instance.pk:
        instance._was_active = (
            sender.objects.filter(pk=instance.pk)
            .values_list("is_active", flat=True)
            .first()
        )
    else:
        instance._was_active = False


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    was_active = getattr(instance, "_was_active", False)

    if not was_active and instance.is_active:
        UserProfile.objects.get_or_create(user=instance)