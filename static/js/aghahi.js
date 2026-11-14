// گرفتن المنت ها
const deleteModal = document.querySelector("#deleteModal");
const dontAskAgain = document.querySelector("#dontAskAgain");
const renewModal = document.querySelector("#renewModal");

let selectedAd = null;

// باز کردن مودال حذف
function opendeletemodal(button) {

    selectedAd = button.closest(".ad-item-box");

    if (!selectedAd) return;

    if (localStorage.getItem("skipDeleteConfirmation") === "true") {
        deleteAd();
        return;
    }

    dontAskAgain.checked = false;

    deleteModal.classList.add("active");
}


// بستن مودال
function closeDeleteModal() {

    deleteModal.classList.remove("active");
    selectedAd = null;
}

function deleteAd() {

    if (!selectedAd) return;

    const adItem = selectedAd;

    // انیمیشن حذف
    adItem.style.maxHeight = adItem.scrollHeight + "px";

    requestAnimationFrame(() => {
        adItem.classList.add("removing");
        adItem.style.maxHeight = "0";
    });
    // توسط بک اند
    // adItem.remove();

    selectedAd = null;
}

function confirmDelete() {

    if (dontAskAgain.checked) {
        localStorage.setItem("skipDeleteConfirmation", "true");
    }

    deleteAd();

    closeDeleteModal();
}

//  باز کردن مودال تمدید

function openRenewModal(button) {
    renewModal.classList.add("active");
}

//  بستن مودال تمدید
function closeRenewModal() {
    renewModal.classList.remove("active");
}

function toggleRenewAccordion() {
    const accordion = document.querySelector(".renew-accordion");
    accordion.classList.toggle("active");
}

function confirmRenew() {

    closeRenewModal();
}

// پاک کردن کش مرورگر
//  localStorage.removeItem("skipDeleteConfirmation");