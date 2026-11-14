import logging

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from django.utils.http import url_has_allowed_host_and_scheme
from django.views import View
from django.views.generic import CreateView, DetailView, ListView

from ads.models import Ads, AdsGallery, Category, City
from dashboard.models import Favorite
from .forms import ReportForm
from .models import UserAddress

logger = logging.getLogger(__name__)

# Create your views here.

class AdsListView(ListView):
    model = Ads
    template_name = 'ads/ads_list.html'
    context_object_name = 'ads'
    paginate_by = 20
    ordering = ['-date_added']

    def get_queryset(self):
        qs = super().get_queryset()

        user = self.request.user
        if user.is_authenticated:
            user_address = UserAddress.objects.filter(user=user).first()
            if user_address and user_address.city:
                qs = qs.filter(city=user_address.city)

        self.q = self.request.GET.get("q", "").strip()
        if self.q:
            qs = qs.filter(
                Q(title__icontains=self.q) |
                Q(description__icontains=self.q) |
                Q(category__name__icontains=self.q)
            )
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["q"] = self.q

        params = self.request.GET.copy()
        params.pop("page", None)
        context["querystring"] = params.urlencode()
        return context


class AdDetailView(DetailView):
    model = Ads
    template_name = 'ads/ad_details.html'
    context_object_name = 'ad'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        ad = self.get_object()
        user = self.request.user
        context["is_favorite"] = (
                user.is_authenticated
                and user.favorites.filter(ad=self.object).exists()
        )
        context['ad'] = ad
        context['ads'] = Ads.objects.filter(city=ad.city).exclude(id=ad.id)[:10]
        return context


class PostAdView(LoginRequiredMixin, CreateView):
    model = Ads
    template_name = "ads/post-ad.html"
    fields = ["title", "description", "price", "category", "city", "product_status"]
    success_url = reverse_lazy("ads:ads-list")
    ad_type = None

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs["instance"] = Ads(ad_type=self.ad_type, user=self.request.user)
        return kwargs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["categories"] = Category.objects.all()
        context["cities"] = City.objects.select_related("province")
        return context

    @transaction.atomic
    def form_valid(self, form):
        response = super().form_valid(form)
        for f in self.request.FILES.getlist("images")[:6]:
            AdsGallery.objects.create(ad=self.object, image=f)
        messages.success(self.request, "آگهی شما ثبت شد.")
        return response


class PostAdViewM(PostAdView):
    ad_type = "product"


class PostAdViewK(PostAdView):
    ad_type = "service"


class ToggleFavoriteView(LoginRequiredMixin, View):
    def post(self, request, pk):
        ad = get_object_or_404(Ads, pk=pk)
        favorite, created = Favorite.objects.get_or_create(user=request.user, ad=ad)

        if created:
            messages.success(request, "به علاقه‌مندی‌ها اضافه شد.")
        else:
            favorite.delete()
            messages.info(request, "از علاقه‌مندی‌ها حذف شد.")

        # go back to the page the user came from
        next_url = request.POST.get("next", "")
        if url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
            return redirect(next_url)
        return redirect(ad.get_absolute_url())


# کلاس زیر گزارش تخلف را ثبت میکند
class ReportCreateView(LoginRequiredMixin, View):

    def post(self, request, ad_id):
        ad = get_object_or_404(Ads, pk=ad_id)
        form = ReportForm(request.POST)

        # اعتبار سنجی فرم گزارش تخلف
        if form.is_valid():
            report = form.save(commit=False)
            report.ad = ad
            report.user = request.user
            report.save()

            # ارسال ایمیل تایید ثبت گزارش
            try:
                send_mail(
                    subject="دریافت گزارش تخلف | آگهی‌دونی",
                    message=(
                        f"سلام {request.user.profile.full_name} عزیز،\n\n"
                        "از اینکه تخلف مشاهده‌شده را به ما اطلاع دادید، سپاسگزاریم.\n"
                        "گزارش شما با موفقیت دریافت شد.\n"
                        "تیم پشتیبانی آگهی‌دونی در اسرع وقت موضوع را بررسی و پیگیری خواهد کرد.\n\n"
                        "از همکاری شما برای ایجاد فضایی امن‌تر سپاسگزاریم.\n"
                        "تیم آگهی‌دونی"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[request.user.email],
                    fail_silently=False,
                )
            except Exception:
                logger.exception("خطا در ارسال ایمیل تایید گزارش تخلف")

            messages.success(
                request, "گزارش تخلف شما با موفقیت ثبت شد")
        else:
            messages.error(
                request, "اطلاعات گزارش معتبر نیست")

        return redirect(ad.get_absolute_url())
