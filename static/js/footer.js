//هاور شدن ایکن های شبکه اجتماعی
const icons = document.querySelectorAll(".socialmedia-box-img");

icons.forEach(function (icon) {

    icon.addEventListener("mouseenter", function () {
        icon.classList.add("active");
    });

    icon.addEventListener("mouseleave", function () {
        icon.classList.remove("active");
    });

});
//برای کوتاه شدن متن در اسکرین های متفاوت
const footerText = document.querySelector(".footer-about-text");

const originalText = footerText.textContent.trim();

function updateFooterText() {
    if (window.innerWidth <= 1040) {
        footerText.textContent = originalText.split(" ").slice(0, 3).join(" ");
    } else {
        footerText.textContent = originalText;
    }
}

window.addEventListener("resize", updateFooterText);

updateFooterText();

//