const sortButtons = document.querySelectorAll(".sort-btn");

// اضافه کردن دکمه کلاس active به دکمه های مرتب سازی زمانی که روی آنها کلیک میشود
sortButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        // حذف کلاس active از بقیه
        sortButtons.forEach(b => b.classList.remove("active"));
        // اضافه کردن به دکمه کلیک‌شده
        this.classList.add("active");
    });
});