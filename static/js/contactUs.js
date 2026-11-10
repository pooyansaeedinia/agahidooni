// توابع کمکی برای اعتبار سنجی فرم ها
// تابع زیر با ساخت یک المنت small خطا های مربوط به هر اینپوت را زیر آن نمایش میدهد
function showError(input, message) {
    const existingError = input.parentElement.querySelector("small");
    if (existingError) existingError.remove();

    input.style.borderColor = "#e74c3c";

    const error = document.createElement("small");
    error.textContent = message;
    error.style.color = "#e74c3c";
    error.style.fontSize = "12px";
    error.style.marginTop = "4px";
    error.style.display = "block";

    input.parentElement.appendChild(error);

    setTimeout(function () {
        if (error && error.parentElement) {
            error.remove();
            input.style.borderColor = "#d0d0d0";
        }
    }, 5000);
}

// تابع زیر تمام خطا ها از بین میبرد
function removeAllErrors() {
    document.querySelectorAll("small").forEach(function (el) {
        el.remove();
    });

    document.querySelectorAll(".form-group input").forEach(function (input) {
        input.style.borderColor = "#d0d0d0";
    })
}

// تابع زیر ایمیل وارد شده توسط کاربر را اعتبارسنجی میکند
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// اعتبار سنجی فرم تماس با ما
// گرفتن المان ها
const contactForm = document.querySelector("#contactForm");
const contactName = document.querySelector("#contactName");
const contactEmail = document.querySelector("#contactEmail");
const contactSubject = document.querySelector("#contactSubject");
const contactMessage = document.querySelector("#contactMessage");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        removeAllErrors()

        let isValid = true;
        // ورودی های فرم تماس با ما
        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const subject = contactSubject.value.trim();
        const message = contactMessage.value.trim();

        if (name === "") {
            showError(contactName, "نام نمی تواند خالی باشد")
            isValid = false;
        }
        if (email === "") {
            showError(contactEmail, "ایمیل نمی تواند خالی باشد")
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(contactEmail, "فرمت ایمیل وارد شده صحیح نمیباشد")
            isValid = false
        }
        if (subject === "") {
            showError(contactSubject, "موضوع نمی تواند خالی باشد")
            isValid = false
        }
        if (message === "") {
            showError(contactMessage, "متن پیام نمی تواند خالی باشد")
            isValid = false
        }
        if (!isValid) {
            event.preventDefault();
        }
    })
}

// بسته شدن تست نویفیکیشن
const toast = document.getElementById("toastNotification");
const toastClose = document.getElementById("toastClose");

// بستن تست با دکمه ضربدر
if (toastClose) {
    toastClose.addEventListener("click", function () {
        toast.classList.remove("active");
    });
}

// بستن خودکار بعد از 5 ثانیه
if (toast && toast.classList.contains("active")) {
    setTimeout(() => {
        toast.classList.remove("active");
    }, 5000);
}
