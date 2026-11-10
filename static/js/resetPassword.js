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

// آیکون های چشم در فرم ها
const toggleIcons = document.querySelectorAll(".toggle-password");

// تابع زیر آیکون های چشم ها را به خط دار و برعکس برای نمایان شدن یا پنهان شدن رمزعبور تغییر میدهد
toggleIcons.forEach(function (icon) {
    icon.addEventListener("click", function () {
        const input = this.parentElement.querySelector("input");
        if (!input) return;

        const type = input.getAttribute("type") === "password" ? "text" : "password";
        input.setAttribute("type", type);

        this.classList.toggle("bi-eye");
        this.classList.toggle("bi-eye-slash");
    })
})

// اعتبار سنجی فرم تغییر رمز عبور
const resetPasswordForm = document.querySelector("#resetPasswordForm")
const newPassword = document.querySelector("#newPassword")
const confirmPassword = document.querySelector("#confirmPassword")

if (resetPasswordForm) {
    console.log("FORM SUBMITTED");
    resetPasswordForm.addEventListener("submit", function (event) {
        removeAllErrors()

        let isValid = true;
        const password = newPassword.value.trim();
        const passwordConfirm = confirmPassword.value.trim();

        if (password === "") {
            showError(newPassword, "رمز عبور جدید نمیتواند خالی باشد");
            isValid = false;
        } else if (password.length < 8) {
            showError(newPassword, "رمز عبور جدید باید حداقل 8 کاراکتر باشد")
            isValid = false;
        }

        if (passwordConfirm === "") {
            showError(confirmPassword, "تکرار رمز عبور نمیتواند خالی باشد")
            isValid = false;
        } else if (password !== passwordConfirm) {
            showError(newPassword, "رمز عبور و تکرار آن یکسان نیستند");
        }
        if (!isValid) {
            event.preventDefault()
        }
    })
}