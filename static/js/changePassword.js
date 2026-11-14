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

const changePasswordForm = document.querySelector("#changePasswordForm");

if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", function (event) {
        removeAllErrors();

        let isValid = true;

        // گرفتن المان ها
        const currentPasswordInput = document.querySelector("#currentPassword");
        const newPasswordInput = document.querySelector("#newPassword");
        const confirmPasswordInput = document.querySelector("#confirmPassword");

        // گرفتن مقادیر المان ها
        const currentPassword = currentPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (currentPassword === "") {
            showError(currentPasswordInput, "وارد کردن رمز عبور فعلی الزامی است");
            isValid = false;
        }

        if (newPassword === "") {
            showError(newPasswordInput, "وارد کردن رمز عبور جدید الزامی است");
            isValid = false;
        } else if (newPassword.length < 8) {
            showError(newPasswordInput, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد");
            isValid = false;
        }

        if (confirmPassword === "") {
            showError(confirmPasswordInput, "تکرار رمز عبور الزامی است");
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            showError(confirmPasswordInput, "رمز عبور جدید و تکرار آن یکسان نیستند");
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
    });
}