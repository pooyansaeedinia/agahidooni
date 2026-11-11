
const AUTH = {
    isLoggedIn: false,
    userName: 'کاربر آگهی دونی'
};

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const overlay = document.getElementById('overlay');
const switchInput = document.getElementById('switch');
const mobileThemeButton = document.getElementById('mobileThemeButton');
const themeText = document.getElementById('themeText');
const cityInput = document.getElementById('cityInput');
const mobileCityInput = document.getElementById('mobileCityInput');

function openMenu() {
    mobileMenu.classList.add('open');
    overlay.classList.add('show');
    mobileMenu.removeAttribute('inert');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeMenu.focus();
}

function closeMenuFunc() {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
    mobileMenu.setAttribute('inert', '');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuToggle.focus();
}

menuToggle.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeMenuFunc);
overlay.addEventListener('click', closeMenuFunc);

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenuFunc();
    }
});

mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenuFunc);
});

function setTheme(theme) {
    const isDark = theme === 'dark';

    document.documentElement.classList.toggle('dark', isDark);
    switchInput.checked = isDark;
    localStorage.setItem('theme', theme);
    themeText.textContent = isDark ? 'حالت روشن' : 'حالت تاریک';

    mobileThemeButton.querySelector('i').className = isDark
        ? 'fa-solid fa-sun menu-icon'
        : 'fa-solid fa-moon menu-icon';
}

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark' || savedTheme === 'light') {
    setTheme(savedTheme);
} else {
    const prefersDark = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    setTheme(prefersDark ? 'dark' : 'light');
}

switchInput.addEventListener('change', function () {
    setTheme(this.checked ? 'dark' : 'light');
});

mobileThemeButton.addEventListener('click', function () {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
});

function updateAuthUI(isLoggedIn, userName = '') {
    const loggedOutSection = document.getElementById('loggedOutSection');
    const loggedInSection = document.getElementById('loggedInSection');
    const logoutButton = document.getElementById('logoutButton');
    const profileName = document.getElementById('profileName');
    const profileDescription = document.getElementById('profileDescription');

    if (isLoggedIn) {
        loggedOutSection.hidden = true;
        loggedInSection.hidden = false;
        logoutButton.hidden = false;
        profileName.textContent = userName || 'کاربر';
        profileDescription.textContent = 'خوش آمدید به آگهی دونی';
    } else {
        loggedOutSection.hidden = false;
        loggedInSection.hidden = true;
        logoutButton.hidden = true;
        profileName.textContent = 'سلام، خوش آمدید!';
        profileDescription.textContent = 'برای استفاده از امکانات وارد شوید';
    }
}

function syncCity(source, target) {
    source.addEventListener('change', function () {
        target.value = this.value;
    });
}

syncCity(cityInput, mobileCityInput);
syncCity(mobileCityInput, cityInput);

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const query = document.getElementById('searchInput').value.trim();

    if (!query) return;

    window.location.href = '/search?q=' + encodeURIComponent(query);
});

let minRange;
let maxRange;
let minValue;
let maxValue;
let sliderRange;

const minGap = 100000;
const maxPrice = 10000000;

function formatPrice(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

function updateSlider() {
    if (!minRange || !maxRange || !minValue || !maxValue || !sliderRange) {
        return;
    }

    let min = Number(minRange.value);
    let max = Number(maxRange.value);

    if (max - min < minGap) {
        if (document.activeElement === minRange) {
            min = max - minGap;
            minRange.value = min;
        } else {
            max = min + minGap;
            maxRange.value = max;
        }
    }

    minValue.textContent = formatPrice(min);
    maxValue.textContent = formatPrice(max);

    const minPercent = (min / maxPrice) * 100;
    const maxPercent = (max / maxPrice) * 100;

    sliderRange.style.left = minPercent + '%';
    sliderRange.style.width = (maxPercent - minPercent) + '%';
}

function initPriceSlider() {
    minRange = document.getElementById('min-range');
    maxRange = document.getElementById('max-range');
    minValue = document.getElementById('min-value');
    maxValue = document.getElementById('max-value');
    sliderRange = document.getElementById('slider-range');

    if (!minRange || !maxRange || !minValue || !maxValue || !sliderRange) {
        return;
    }

    minRange.addEventListener('input', updateSlider);
    maxRange.addEventListener('input', updateSlider);

    updateSlider();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPriceSlider);
} else {
    initPriceSlider();
}

document.addEventListener('DOMContentLoaded', function () {
    const openBtn = document.getElementById('filterOpenBtn');
    const closeBtn = document.getElementById('filterCloseBtn');
    const modal = document.getElementById('filterModal');
    const filterOverlay = document.getElementById('filterOverlay');

    const searchInput = document.getElementById('filterSearchInput');
    const clearSearch = document.getElementById('clearFilterSearch');
    const searchResults = document.getElementById('filterSearchResults');

    const resetBtn = document.getElementById('resetFiltersBtn');
    const applyBtn = document.getElementById('applyFiltersBtn');

    if (!openBtn || !modal || !filterOverlay) return;

    function openFilter() {
        modal.classList.add('show');
        filterOverlay.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        searchInput?.focus();
    }

    function closeFilter() {
        modal.classList.remove('show');
        filterOverlay.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (searchResults) {
            searchResults.hidden = true;
        }

        openBtn.focus();
    }

    openBtn.addEventListener('click', openFilter);

    if (closeBtn) {
        closeBtn.addEventListener('click', closeFilter);
    }

    filterOverlay.addEventListener('click', closeFilter);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeFilter();
        }
    });

    if (clearSearch && searchInput) {
        clearSearch.addEventListener('click', function () {
            searchInput.value = '';

            if (searchResults) {
                searchResults.innerHTML = '';
                searchResults.hidden = true;
            }

            clearSearch.classList.remove('visible');
            searchInput.focus();
        });
    }

    if (searchInput && clearSearch) {
        searchInput.addEventListener('input', function () {
            clearSearch.classList.toggle('visible', this.value.trim().length > 0);

            if (searchResults) {
                searchResults.innerHTML = '';
                searchResults.hidden = true;
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            modal.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
                input.checked = false;
            });

            const filterCity = document.getElementById('filterCity');

            if (filterCity) {
                filterCity.value = '';
            }

            if (searchInput) {
                searchInput.value = '';
            }

            if (searchResults) {
                searchResults.innerHTML = '';
                searchResults.hidden = true;
            }

            if (clearSearch) {
                clearSearch.classList.remove('visible');
            }

            if (minRange && maxRange) {
                minRange.value = 500000;
                maxRange.value = 8000000;
                updateSlider();
            }
        });
    }

    /*
    applyBtn.addEventListener('click', function () {
        const filters = {
            categories: Array.from(
                modal.querySelectorAll('input[name="category"]:checked')
            ).map(function (input) {
                return input.value;
            }),

            conditions: Array.from(
                modal.querySelectorAll('input[name="condition"]:checked')
            ).map(function (input) {
                return input.value;
            }),

            features: Array.from(
                modal.querySelectorAll('input[name="features"]:checked')
            ).map(function (input) {
                return input.value;
            }),

            minPrice: minRange ? Number(minRange.value) : null,
            maxPrice: maxRange ? Number(maxRange.value) : null,

            city: document.getElementById('filterCity').value.trim()
        };

        window.dispatchEvent(
            new CustomEvent('ads:filters-submit', {
                detail: filters
            })
        );

        closeFilter();
        console.log('Selected filters:', filters);
    });
    */
});

/*
window.addEventListener('ads:filters-submit', function (event) {
    const filters = event.detail;
    console.log(filters);
});
*/

document.addEventListener('DOMContentLoaded', function () {
    const mobileCategories = [
        ['وسایل نقلیه', 'وسایل نقلیه'],
        ['کالای دیجیتال', 'کالای دیجیتال'],
        ['وسایل خانگی', 'وسایل خانگی'],
        ['سرگرمی', 'سرگرمی و ورزش'],
        ['املاک', 'املاک'],
        ['خدمات', 'خدمات'],
        ['مد و پوشاک', 'مد و پوشاک'],
        ['لوازم شخصی', 'لوازم شخصی'],
        ['کتاب', 'کتاب و لوازم تحریر'],
        ['آموزش', 'آموزش و کلاس‌های آموزشی'],
        ['حیوانات', 'حیوانات و لوازم حیوانات'],
        ['کشاورزی', 'کشاورزی و دامداری'],
        ['مواد غذایی', 'مواد غذایی و خوراکی'],
        ['زیبایی', 'زیبایی و سلامت'],
        ['لوازم کودک', 'لوازم کودک و نوزاد'],
        ['استخدام', 'استخدام و کاریابی'],
        ['صنعت', 'صنعت و تجهیزات'],
        ['مراسم', 'مراسم و مجالس'],
        ['موبایل', 'موبایل و لوازم جانبی'],
        ['کامپیوتر', 'کامپیوتر و لپ‌تاپ'],
        ['قطعات الکترونیکی', 'قطعات الکترونیکی'],
        ['لوازم صوتی', 'لوازم صوتی و تصویری'],
        ['دکوراسیون', 'دکوراسیون و لوازم تزئینی'],
        ['آلات موسیقی', 'آلات موسیقی و تجهیزات'],
        ['هنر و صنایع دستی', 'هنر و صنایع دستی'],
        ['ورزش', 'تجهیزات ورزشی و بدنسازی'],
        ['دوچرخه', 'دوچرخه و لوازم جانبی'],
        ['عکاسی', 'دوربین و تجهیزات عکاسی'],
        ['لوازم اداری', 'لوازم اداری و شرکتی'],
        ['تجهیزات پزشکی', 'تجهیزات پزشکی و آزمایشگاهی'],
        ['ساختمان', 'مصالح ساختمانی و تأسیسات'],
        ['صنایع چوب', 'صنایع چوب و نجاری'],
        ['خدمات فنی', 'تعمیرات و خدمات فنی'],
        ['حمل و نقل', 'حمل‌ونقل و باربری'],
        ['اجاره', 'اجاره وسایل و تجهیزات'],
        ['باغبانی', 'باغبانی و گل و گیاه'],
        ['جهیزیه', 'جهیزیه و لوازم عروس'],
        ['کلکسیونی', 'اشیای قدیمی و کلکسیونی'],
        ['سفر', 'لوازم سفر و کمپینگ'],
        ['تبلیغات', 'تبلیغات و بازاریابی'],
        ['خدمات اینترنتی', 'خدمات اینترنتی و دیجیتال'],
        ['مهمانی', 'تجهیزات پذیرایی و مهمانی'],
        ['سایر', 'سایر موارد']
    ];

    const categoryContainer = document.getElementById('mobileCategoryOptions');

    if (categoryContainer) {
        mobileCategories.forEach(([value, title], index) => {
            const label = document.createElement('label');
            label.className = 'mobile-filter-option';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = 'mobileCategory';
            input.value = value;
            input.id = `mobileCategory_${index}`;

            const span = document.createElement('span');
            span.textContent = title;

            label.append(input, span);
            categoryContainer.appendChild(label);
        });
    }

    const accordionButtons = document.querySelectorAll(
        '.mobile-filter-accordion-toggle'
    );

    accordionButtons.forEach(button => {
        button.addEventListener('click', function () {
            const isOpen = button.getAttribute('aria-expanded') === 'true';

            const content = document.getElementById(
                button.getAttribute('aria-controls')
            );

            if (!content) return;

            button.setAttribute('aria-expanded', String(!isOpen));

            content.setAttribute('aria-hidden', String(isOpen));
            content.inert = isOpen;

            if (isOpen) {
                content.classList.remove('is-open');
                content.style.maxHeight = '0px';
            } else {
                content.classList.add('is-open');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    document.querySelectorAll('[data-clear-group]').forEach(button => {
        button.addEventListener('click', function () {
            const accordion = button.closest('.mobile-filter-accordion');

            if (!accordion) return;

            accordion.querySelectorAll('input[type="checkbox"]').forEach(input => {
                input.checked = false;
            });

            accordion.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => {
                input.value = '';
            });
        });
    });

    const resetButton = document.getElementById('mobileResetFilters');

    if (resetButton) {
        resetButton.addEventListener('click', function () {
            document.querySelectorAll('.mobile-filter-accordion').forEach(accordion => {
                accordion.querySelectorAll('input[type="checkbox"]').forEach(input => {
                    input.checked = false;
                });

                accordion.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => {
                    input.value = '';
                });
            });
        });
    }
});
