// مودال تماس با فروشنده
// گرفتن المان ها
const contactBtn = document.getElementById("contactBtn");
const contactModal = document.getElementById("contactModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const copyBtn = document.getElementById("copyBtn");
const phoneNumber = document.getElementById("phoneNumber");

// باز کردن مودال
if (contactBtn) {
    contactBtn.addEventListener("click", function () {
        contactModal.classList.add("active");
        document.body.style.overflow = "hidden"; // جلوگیری از اسکرول پس‌زمینه
    });
}

// بستن مودال با دکمه ضربدر
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
        contactModal.classList.remove("active");
        document.body.style.overflow = "";
    });
}

// بستن مودال با کلیک بیرون از آن
if (contactModal) {
    contactModal.addEventListener("click", function (e) {
        if (e.target === contactModal) {
            contactModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
}

// مودال گزارش تخلف
// گرفتن المان ها
const reportBtn = document.getElementById("reportBtn");
const reportModal = document.getElementById("reportModal");
const reportModalOverlay = document.getElementById("reportModalOverlay");
const reportModalClose = document.getElementById("reportModalClose");
const reportModalCancel = document.getElementById("reportModalCancel");

// باز کردن مودال
if (reportBtn) {
    reportBtn.addEventListener("click", function () {
        reportModal.classList.add("active");
        document.body.style.overflow = "hidden";
    });
}

// فانکشن بستن مودال
function closeReportModal() {
    reportModal.classList.remove("active");
    document.body.style.overflow = "";
}

if (reportModalClose) reportModalClose.addEventListener("click", closeReportModal);
if (reportModalCancel) reportModalCancel.addEventListener("click", closeReportModal);
if (reportModalOverlay) reportModalOverlay.addEventListener("click", closeReportModal);

// بستن با Esc
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && reportModal.classList.contains("active")) {
        closeReportModal();
    }
});

// تست نوتیفیکیشن
// گرفتن المان ها
const toast = document.getElementById("toastNotification");
const toastIcon = document.getElementById("toastIcon");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");
const toastClose = document.getElementById("toastClose");

let toastTimeout; // برای نگه داشتن تایمر

// تابع نمایش پیغام
function showToast(title, message, type = "success") {
    // پاک کردن تایمر قبلی
    clearTimeout(toastTimeout);

    // ست کردن محتوای پیام
    toastTitle.textContent = title;
    toastMessage.textContent = message;

    // تنظیم آیکون تیک یا هشدار
    if (type === "success") {
        toastIcon.className = "bi bi-check-circle-fill";
        toast.style.borderColor = "var(--success)";
        toastIcon.style.color = "var(--success)";
    } else if (type === "error") {
        toastIcon.className = "bi bi-exclamation-circle-fill";
        toast.style.borderColor = "var(--danger)";
        toastIcon.style.color = "var(--danger)";
    }

    toast.classList.add("active");

    toastTimeout = setTimeout(() => {
        toast.classList.remove("active");
    }, 4000);
}

// بسته شدن تست با استفاده از کلیک بر روی ضربدر
if (toastClose) {
    toastClose.addEventListener("click", function () {
        toast.classList.remove("active");
        clearTimeout(toastTimeout);
    });
}

// دکمه افزودن به علاقه مندی ها
const favBtn = document.getElementById("favBtn");

if (favBtn) {
    favBtn.addEventListener("click", function () {
        // دریافت آیکون
        const icon = this.querySelector("i");

        //در این قسمت اگر دکمه کلیک نشده باشد قلب خالی تبدیل به قلب تو پر میشود (یعنی به عبارتی آیکون عوض میشود) و در نهایت تست نویفیکیشن به کاربر نمایش داده میشود در غیر این صورت قلب تو پر تبدیل به قلب تو خالی میشود
        if (icon.classList.contains("bi-heart")) {
            icon.classList.remove("bi-heart");
            icon.classList.add("bi-heart-fill");
            // اینجا به کادر دکمه، بوردر می دهیم
            this.style.color = "var(--danger)";
            this.style.borderColor = "var(--danger)";

            showToast("موفقیت", "آگهی به علاقه‌مندی‌ها اضافه شد.", "success");

        } else {
            icon.classList.remove("bi-heart-fill");
            icon.classList.add("bi-heart");
            this.style.color = "";
            this.style.borderColor = "";

            showToast("توجه", "آگهی از علاقه‌مندی‌ها حذف شد", "error");
        }
    });
}
// اسلایدر (از کد هایی که قبلا نوشته بودم استفاده کردم)
const sliderWrapper = document.getElementById("newSliderWrapper");
const prevBtn = document.getElementById("prevNewBtn");
const nextBtn = document.getElementById("nextNewBtn");

if (sliderWrapper && prevBtn && nextBtn) {

    // تابع زیر عملیات اسکرول شدن کارت ها را انجام میدهد
    function scrollSlider(direction) {
        const firstCard = sliderWrapper.querySelector(".ad-card");
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth + 20;

        sliderWrapper.scrollBy({
            left: direction * cardWidth,
            behavior: "smooth"
        });
    }

    // اضافه کردن رویدار به دکمه های قبل و بعد
    nextBtn.addEventListener("click", () => scrollSlider(-1));
    prevBtn.addEventListener("click", () => scrollSlider(1));

    function updateButtonsState() {

        const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
        const currentScroll = Math.abs(sliderWrapper.scrollLeft);
    }

    // اجرای اولیه
    updateButtonsState();

    // به‌روزرسانی با اسکرول
    sliderWrapper.addEventListener("scroll", updateButtonsState);

    // به‌روزرسانی با تغییر سایز صفحه
    window.addEventListener("resize", updateButtonsState);
}

// جابه جا کردن عکس اصلی با عکس های گالری
const mainImage = document.getElementById("mainImage");
const thumbItems = document.querySelectorAll(".thumb-item");

if (mainImage && thumbItems.length > 0) {
    thumbItems.forEach(thumb => {
        thumb.addEventListener("click", function () {

            const thumbImg = this.querySelector("img");
            if (!thumbImg) return;

            // جا به جا کردن عکس ها
            mainImage.src = thumbImg.src;
            mainImage.alt = thumbImg.alt;

            thumbItems.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
        });
    });
}

console.log("hello")