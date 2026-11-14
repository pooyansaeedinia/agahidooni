// گرفتن المان‌ها
const modal = document.querySelector("#addressModal");
const titleInput = document.querySelector("#addressTitle");
const provinceInput = document.querySelector("#addressProvince");
const cityInput = document.querySelector("#addressCity");
const fullInput = document.querySelector("#addressFull");
const postalCodeInput = document.querySelector("#addressPostalCode");
const phoneInput = document.querySelector("#addressPhone");
const defaultCheckbox = document.querySelector("#addressIsDefault");

// تابع زیر مودال را باز میکند
function openModal(title = "افزودن آدرس جدید") {
    document.querySelector("#addressModalTitle").textContent = title;
    modal.classList.add("active");
}

// تابع زیر مودال را می بندد
function closeModal() {
    modal.classList.remove("active");
}

// دکمه افزودن آدرس جدید
document.querySelector(".add-address-btn").addEventListener("click", () => {
    document.querySelector("#addressForm").reset();
    document.querySelector("#editingAddressId").value = "";
    openModal();
});

// دکمه ویرایش آدرس
document.querySelectorAll("[data-id]:not(.danger)").forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();

        // پر کردن فیلدها با دیتا هایی که از سمت دیتابیس می آید
        document.querySelector("#editingAddressId").value = this.dataset.id;
        titleInput.value = this.dataset.title;
        provinceInput.value = this.dataset.province;
        cityInput.value = this.dataset.city;
        fullInput.value = this.dataset.address;
        postalCodeInput.value = this.dataset.postalCode;
        phoneInput.value = this.dataset.phone;
        defaultCheckbox.checked = (this.dataset.isDefault === "true");

        openModal("ویرایش آدرس");
    });
});

// بستن مودال با استفاده از دکمه های ضربدر ، انصراف و کلیک روی اورلی
document.querySelector("#addressModalClose").addEventListener("click", closeModal);
document.querySelector("#addressModalCancel").addEventListener("click", closeModal);
document.querySelector("#addressModalOverlay").addEventListener("click", closeModal);

// بستن مودال با استفاده از دکمه Esc روی کیبورد
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});


// ********************************************
// مودال حذف:
// گرفتن المنت ها 

const addressDeleteModal = document.querySelector("#addressDeleteModal");
const dontAskAddressAgain = document.querySelector("#dontAskAddressAgain");

let selectedAddress = null;


// باز کردن مودال حذف آدرس
function openAddressDeleteModal(button) {

    selectedAddress = button.closest(".address-card");

    if (!selectedAddress) return;

    if (localStorage.getItem("skipAddressConfirmation") === "true") {
        deleteAddress();
        return;
    }

    dontAskAddressAgain.checked = false;

    addressDeleteModal.classList.add("active");
}

// بستن مودال
function closeAddressDeleteModal() {

    addressDeleteModal.classList.remove("active");

    selectedAddress = null;
}

// حذف آدرس
function deleteAddress() {

    if (!selectedAddress) return;

    const addressItem = selectedAddress;

    // انیمیشن

    setTimeout(() => {

        addressItem.style.maxHeight = addressItem.scrollHeight + "px";

        requestAnimationFrame(() => {
            addressItem.classList.add("removing");
            addressItem.style.maxHeight = "0";
        });

        setTimeout(() => {
            addressItem.remove();
        }, 450);

    }, 200);

    selectedAddress = null;
}

function confirmAddressDelete() {

    if (!selectedAddress) return;

    if (dontAskAddressAgain.checked) {
        localStorage.setItem("skipAddressConfirmation", "true");
    }

    deleteAddress();

    closeAddressDeleteModal();
}
// برای پاک کردن حافظه کش
// localStorage.removeItem("skipAddressConfirmation");
// sessionStorage.clear();