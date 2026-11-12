from ads.models import Category


def site_context(request):
    return {
        "footer_categories": Category.objects.all()[:5],
    }