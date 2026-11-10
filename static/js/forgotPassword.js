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
        if (error && error.remove()) {
            error.remove();
            input.style.borderColor = "#d0d0d0";
        }
    }, 3000);
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

// اعتبار سنجی فرم فرامو
const forgotForm = document.querySelector(".forgot-form");
const forgotEmail = document.querySelector("#forgot-email");

if(forgotForm) {
    console.log("FORM SUBMITTED");
    forgotForm.addEventListener("submit", function (event) {
        removeAllErrors();

        let isValid = true;
        const email = forgotEmail.value.trim();

        if(email === "") {
            showError(forgotEmail, "ایمیل نمی‌تواند خالی باشد");
            isValid = false;
        } else if(!isValidEmail(email)) {
            showError(forgotEmail, "فرمت ایمیل صحیح نیست (مثال: example@gmail.com)");
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault()
        }
    });
}