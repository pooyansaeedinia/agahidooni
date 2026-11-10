// گرفتن المان های اصلی
const adCards = Array.from(document.querySelectorAll(".ad-card"));
const adsGrid = document.querySelector(".ads-grid");
const filterBtn = document.querySelector(".filter-btn");
const filterSidebar = document.getElementById("filterSidebar");
const closeFilterBtn = document.getElementById("closeFilterBtn");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const sortButtons = document.querySelectorAll(".sort-btn");

// تابع زیر با استفاده از دکمه فیلتر عملیات باز کردن فیلتر ساید بار را انجام میدهد
function openFilter() {
    filterSidebar.classList.add("active");
    document.body.style.overflow = "hidden"; // قفل اسکرول
}

// تابع زیر با استفاده از دکمه ضربدر عملیات بستن فیلتر ساید بار را انجام میدهد
function closeFilter() {
    filterSidebar.classList.remove("active");
    document.body.style.overflow = "";
}

// اعمال توابع با کلیک به روی دکمه های ذکر شده
if (filterBtn) filterBtn.addEventListener("click", openFilter);
if (closeFilterBtn) closeFilterBtn.addEventListener("click", closeFilter);

// بستن فیلتر ساید بار با کلیک کردن خارج از فضای ساید بار
document.addEventListener("click", function (e) {
    if (
        filterSidebar.classList.contains("active") &&
        !filterSidebar.contains(e.target) &&
        !filterBtn.contains(e.target)
    ) {
        closeFilter();
    }
});

// تابع زیر عملیات فیلتر کردن دیتا ها را انجام میدهد
function applyFilters() {
    // گرفتن کتگوری ها
    const selectedCategories = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
    ).map(cb => cb.value);

    // گرفتن نوع آگهی
    const selectedTypes = Array.from(
        document.querySelectorAll('input[name="type"]:checked')
    ).map(cb => cb.value);

    // گرفتن المان های قیمت به همراه استان و شهر
    const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;
    const selectedProvince = document.getElementById("provinceFilter").value;
    const selectedCity = document.getElementById("cityFilter").value;

    // تعداد آگهی هایی که نمایش داده میشوند
    let visibleCount = 0;

    // با استفاده از foreach تمامی کارت ها را برسی میکنیم
    adCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const cardPrice = parseInt(card.dataset.price) || 0;
        const cardProvince = card.dataset.province;
        const cardCity = card.dataset.city;
        const cardType = card.dataset.type || "normal";

        // تطابق کارت های آگهی با با شروط به صورت پیش فرض
        let isMatch = true;

        // شرط دسته بندی
        if (selectedCategories.length > 0 && !selectedCategories.includes(cardCategory)) {
            isMatch = false;
        }

        // شرط قیمت
        if (cardPrice < minPrice || cardPrice > maxPrice) {
            isMatch = false;
        }

        // شرط استان
        if (selectedProvince !== "" && cardProvince !== selectedProvince) {
            isMatch = false;
        }

        // شرط شهر
        if (selectedCity !== "" && cardCity !== selectedCity) {
            isMatch = false;
        }

        // شرط نوع آگهی
        if (selectedTypes.length > 0 && !selectedTypes.includes(cardType)) {
            isMatch = false;
        }

        // نمایش / مخفی
        if (isMatch) {
            card.classList.remove("hidden");
            visibleCount++;
        } else {
            card.classList.add("hidden");
        }
    });

    // بستن سایدبار
    closeFilter();
}

// مرتب کردن آگهی ها بر اساس ارزان ترین آگهی ها ، گران ترین آگهی ها ، جدیدترین آگهی ها و قدیمی ترین آگهی ها
function sortAds(sortType) {
    let sortedCards = [...adCards];

    switch (sortType) {
        case "ارزان‌ترین":
            sortedCards.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
            break;

        case "گران ترین":
            sortedCards.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
            break;

        case "جدیدترین":
            sortedCards.sort((a, b) => parseInt(a.dataset.date) - parseInt(b.dataset.date));
            break;

        case "قدیمی‌ترین":
            sortedCards.sort((a, b) => parseInt(b.dataset.date) - parseInt(a.dataset.date));
            break;
    }

    // چیدن مجدد کارت‌ها در گرید
    sortedCards.forEach(card => adsGrid.appendChild(card));
}

// اعمال تمامی فیلتر های انتخاب شده در فیلتر ساید بار
if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", applyFilters);
}

// حذف کردن تمام فیلتر های انتخاب شده در فیلتر ساید بار
if (clearFilterBtn) {
    clearFilterBtn.addEventListener("click", function () {
        // پاک کردن چک‌باکس‌ها
        document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
        // پاک کردن قیمت‌ها
        document.getElementById("minPrice").value = "";
        document.getElementById("maxPrice").value = "";
        // ریست سلکت‌ها
        document.getElementById("provinceFilter").value = "";
        document.getElementById("cityFilter").value = "";

        // نمایش مجدد همه کارت‌ها
        adCards.forEach(card => card.classList.remove("hidden"));

        // حذف پیام خالی
        const noResultMsg = document.getElementById("noResultMsg");
        if (noResultMsg) noResultMsg.remove();
    });
}

// اضافه کردن دکمه کلاس active به دکمه های مرتب سازی زمانی که روی آنها کلیک میشود
sortButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        // حذف کلاس active از بقیه
        sortButtons.forEach(b => b.classList.remove("active"));
        // اضافه کردن به دکمه کلیک‌شده
        this.classList.add("active");

        sortAds(this.textContent.trim());
    });
});