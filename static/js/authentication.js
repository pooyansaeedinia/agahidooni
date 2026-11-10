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

// تابع زیر ایمیل وارد شده توسط کاربر را اعتبارسنجی میکند
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// تابع زیر شماره تلفن وارد شده توسط کاربر را اعتبارسنجی میکند
function isValidPhone(phone) {
    const regex = /^09\d{9}$/;
    return regex.test(phone);
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

// اعتباز سنجی فرم ورود
const loginForm = document.querySelector(".login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        removeAllErrors();

        let isValid = true;
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        if (email === "") {
            showError(loginEmail, "ایمیل نمی‌تواند خالی باشد");
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(loginEmail, "فرمت ایمیل وارد شده صحیح نمیباشد");
            isValid = false;
        }

        if (password === "") {
            showError(loginPassword, "رمز عبور نمی‌تواند خالی باشد");
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
    })
}

// اعتبار سنجی فرم ثبت نام
const signupForm = document.querySelector(".signup-form");
const signupEmail = document.querySelector("#signup-email");
const signupPassword = document.querySelector("#signup-password");
const signupConfirmationPassword = document.querySelector("#signup-confirmation-password");

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        removeAllErrors();

        let isValid = true;
        const email = signupEmail.value.trim();
        const password = signupPassword.value.trim();
        const confirmationPassword = signupConfirmationPassword.value.trim();

        if (email === "") {
            showError(signupEmail, "ایمیل نمی‌تواند خالی باشد");
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(signupEmail, "فرمت ایمیل وارد شده صحیح نمیباشد");
            isValid = false;
        }

        if (password === "") {
            showError(signupPassword, "رمز عبور نمی‌تواند خالی باشد");
            isValid = false;
        } else if (password.length < 8) {
            showError(signupPassword, "رمز عبور باید حداقل 8 کاراکتر باشد");
            isValid = false;
        }

        if (confirmationPassword === "") {
            showError(signupConfirmationPassword, "تکرار رمز عبور نمی‌تواند خالی باشد");
            isValid = false;
        } else if (password !== confirmationPassword) {
            showError(signupConfirmationPassword, "رمز عبور و تکرار آن یکسان نیستند");
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
    })
}