// گرفتن المنت ها
const favoriteDeleteModal = document.querySelector("#favoriteDeleteModal");
const dontAskFavoriteAgain = document.querySelector("#dontAskFavoriteAgain");

let selectedFavoriteButton = null;


// باز کردن مودال 
function openFavoriteModal(button) {

    selectedFavoriteButton = button;

    if (localStorage.getItem("skipFavoriteConfirmation") === "true") {
        confirmFavoriteDelete();
        return;
    }

    dontAskFavoriteAgain.checked = false;
    favoriteDeleteModal.classList.add("active");
}


// بستن مودال
function closeFavoriteModal() {

    favoriteDeleteModal.classList.remove("active");
    selectedFavoriteButton = null;
}


function confirmFavoriteDelete() {

    if (!selectedFavoriteButton) return;

    const button = selectedFavoriteButton;
    const favoriteItem = button.closest(".fav-item-box");

    if (!favoriteItem) return;

    if (dontAskFavoriteAgain.checked) {
        localStorage.setItem("skipFavoriteConfirmation", "true");
    }

    button.disabled = true;

    const heartIcon = button.querySelector("i");

    if (heartIcon) {
        heartIcon.classList.remove("fa-solid");
        heartIcon.classList.add("fa-regular");
    }

    closeFavoriteModal();

    // انیمیشن حذف
    setTimeout(() => {

        favoriteItem.style.maxHeight = favoriteItem.scrollHeight + "px";

        requestAnimationFrame(() => {
            favoriteItem.classList.add("removing");
            favoriteItem.style.maxHeight = "0";
        });

        // حذف  توسط بک‌اند
        // favoriteItem.remove();

    }, 200);
}

// پاک کردن کش مرورگر
// localStorage.removeItem("skipFavoriteConfirmation");
// sessionStorage.clear();