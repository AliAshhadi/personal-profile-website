// Tab switching
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

function setActiveTab(tabId) {
    tabButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === tabId);
    });
    tabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === tabId);
    });
}

tabButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

// Mode toggle
const modeInputs = document.querySelectorAll("input[name='mode']");
const modePanels = document.querySelectorAll(".mode-panel");

function setMode(mode) {
    modePanels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.mode !== mode);
    });
    state.mode = mode;
}

// Icon library data (defaults from template + website)
const iconLibrary = {
    phone: {
        name: "Phone",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"></path></svg>',
        builtIn: true
    },
    email: {
        name: "Email",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"></path></svg>',
        builtIn: true
    },
    linkedin: {
        name: "LinkedIn",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z"></path></svg>',
        builtIn: true
    },
    whatsapp: {
        name: "WhatsApp",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22ZM8.39232 7.30833C8.5262 7.29892 8.66053 7.29748 8.79459 7.30402C8.84875 7.30758 8.90265 7.31384 8.95659 7.32007C9.11585 7.33846 9.29098 7.43545 9.34986 7.56894C9.64818 8.24536 9.93764 8.92565 10.2182 9.60963C10.2801 9.76062 10.2428 9.95633 10.125 10.1457C10.0652 10.2428 9.97128 10.379 9.86248 10.5183C9.74939 10.663 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.40738 11.0473 9.44455 11.1944C9.45903 11.25 9.50521 11.331 9.54708 11.3991C9.57027 11.4368 9.5918 11.4705 9.60577 11.4938C9.86169 11.9211 10.2057 12.3543 10.6259 12.7616C10.7463 12.8783 10.8631 12.9974 10.9887 13.108C11.457 13.5209 11.9868 13.8583 12.559 14.1082L12.5641 14.1105C12.6486 14.1469 12.692 14.1668 12.8157 14.2193C12.8781 14.2457 12.9419 14.2685 13.0074 14.2858C13.0311 14.292 13.0554 14.2955 13.0798 14.2972C13.2415 14.3069 13.335 14.2032 13.3749 14.1555C14.0984 13.279 14.1646 13.2218 14.1696 13.2222V13.2238C14.2647 13.1236 14.4142 13.0888 14.5476 13.097C14.6085 13.1007 14.6691 13.1124 14.7245 13.1377C15.2563 13.3803 16.1258 13.7587 16.1258 13.7587L16.7073 14.0201C16.8047 14.0671 16.8936 14.1778 16.8979 14.2854C16.9005 14.3523 16.9077 14.4603 16.8838 14.6579C16.8525 14.9166 16.7738 15.2281 16.6956 15.3913C16.6406 15.5058 16.5694 15.6074 16.4866 15.6934C16.3743 15.81 16.2909 15.8808 16.1559 15.9814C16.0737 16.0426 16.0311 16.0714 16.0311 16.0714C15.8922 16.159 15.8139 16.2028 15.6484 16.2909C15.391 16.428 15.1066 16.5068 14.8153 16.5218C14.6296 16.5313 14.4444 16.5447 14.2589 16.5347C14.2507 16.5342 13.6907 16.4482 13.6907 16.4482C12.2688 16.0742 10.9538 15.3736 9.85034 14.402C9.62473 14.2034 9.4155 13.9885 9.20194 13.7759C8.31288 12.8908 7.63982 11.9364 7.23169 11.0336C7.03043 10.5884 6.90299 10.1116 6.90098 9.62098C6.89729 9.01405 7.09599 8.4232 7.46569 7.94186C7.53857 7.84697 7.60774 7.74855 7.72709 7.63586C7.85348 7.51651 7.93392 7.45244 8.02057 7.40811C8.13607 7.34902 8.26293 7.31742 8.39232 7.30833Z"></path></svg>',
        builtIn: true
    },
    telegram: {
        name: "Telegram",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.14753 11.8099C7.3949 9.52374 10.894 8.01654 12.6447 7.28833C17.6435 5.20916 18.6822 4.84799 19.3592 4.83606C19.5081 4.83344 19.8411 4.87034 20.0567 5.04534C20.2388 5.1931 20.2889 5.39271 20.3129 5.5328C20.3369 5.6729 20.3667 5.99204 20.343 6.2414C20.0721 9.08763 18.9 15.9947 18.3037 19.1825C18.0514 20.5314 17.5546 20.9836 17.0736 21.0279C16.0283 21.1241 15.2345 20.3371 14.2221 19.6735C12.6379 18.635 11.7429 17.9885 10.2051 16.9751C8.42795 15.804 9.58001 15.1603 10.5928 14.1084C10.8579 13.8331 15.4635 9.64397 15.5526 9.26395C15.5637 9.21642 15.5741 9.03926 15.4688 8.94571C15.3636 8.85216 15.2083 8.88415 15.0962 8.9096C14.9373 8.94566 12.4064 10.6184 7.50365 13.928C6.78528 14.4212 6.13461 14.6616 5.55163 14.649C4.90893 14.6351 3.67265 14.2856 2.7536 13.9869C1.62635 13.6204 0.730432 13.4267 0.808447 12.8044C0.849081 12.4803 1.29544 12.1488 2.14753 11.8099Z"></path></svg>',
        builtIn: true
    },
    website: {
        name: "Website",
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33256C6.71639 5.22533 4.458 7.8235 4.06189 11ZM10.0307 11H13.9693C13.8189 8.56122 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56122 10.0307 11ZM14.29 4.33256C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22533 14.29 4.33256Z"></path></svg>',
        builtIn: true
    }
};

let rowIdCounter = 1;
let rows = [
    { id: rowIdCounter++, label: "تلفن", type: "phone", icon: "phone" },
    { id: rowIdCounter++, label: "ایمیل", type: "email", icon: "email" },
    { id: rowIdCounter++, label: "لینکدین", type: "link", icon: "linkedin" },
    { id: rowIdCounter++, label: "واتساپ", type: "link", icon: "whatsapp" },
    { id: rowIdCounter++, label: "تلگرام", type: "link", icon: "telegram" },
    { id: rowIdCounter++, label: "وب‌سایت", type: "link", icon: "website" }
];

const state = {
    mode: "single",
    theme: {
        font: "Vazir",
        fontFile: null,
        defaultMode: "dark",
        accent: {
            style: "gradient",
            color: "#2e7bc8",
            solidColor: "#2e7bc8"
        },
        text: {
            light: { title: "#444444", subtitle: "#666666" },
            dark: { title: "#ffffff", subtitle: "#cccccc" }
        },
        background: {
            light: { page: "#f6f6f7", card: "#ffffff" },
            dark: { page: "#1a1a1a", card: "#333333" }
        }
    },
    rows,
    icons: iconLibrary,
    data: {
        single: {
            name: "",
            subtitle1: "",
            subtitle2: "",
            profileFile: null,
            rowValues: {}
        },
        batch: {
            people: [],
            warnings: [],
            images: []
        }
    },
    exportWarnings: []
};

window.appState = state;

const rowListEl = document.getElementById("row-list");
const addRowBtn = document.getElementById("add-row");
const iconGridEl = document.getElementById("icon-grid");
const iconSearchEl = document.getElementById("icon-search");
const iconNameEl = document.getElementById("icon-name");
const customSvgEl = document.getElementById("custom-svg");
const addIconBtn = document.getElementById("add-icon");
const singleRowValuesEl = document.getElementById("single-row-values");
const fontSelectEl = document.getElementById("font");
const customFontField = document.getElementById("custom-font-field");
const accentStyleEl = document.getElementById("accent-style");
const accentGradientField = document.getElementById("accent-gradient-field");
const accentSolidField = document.getElementById("accent-solid-field");
const accentColorEl = document.getElementById("accent-color");
const solidColorEl = document.getElementById("solid-color");
const lightTitleEl = document.getElementById("light-title");
const lightSubEl = document.getElementById("light-sub");
const darkTitleEl = document.getElementById("dark-title");
const darkSubEl = document.getElementById("dark-sub");
const pageBgEl = document.getElementById("page-bg");
const cardBgEl = document.getElementById("card-bg");
const resetColorsBtn = document.getElementById("reset-colors");
const defaultModeEls = document.querySelectorAll("input[name='default-mode']");
const nameEl = document.getElementById("name");
const subtitle1El = document.getElementById("subtitle1");
const subtitle2El = document.getElementById("subtitle2");
const profileEl = document.getElementById("profile");
const templateBtn = document.getElementById("download-template");
const xlsxInput = document.getElementById("xlsx");
const imagesFolderInput = document.getElementById("images-folder");
const batchSummaryEl = document.getElementById("batch-summary");
const batchWarningsEl = document.getElementById("batch-warnings");
const exportBtn = document.getElementById("export-btn");
const zipBtn = document.getElementById("zip-btn");
const exportWarningsEl = document.getElementById("export-warnings");

function slugify(text, fallback) {
    const slug = text
        .toString()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w\-\u0600-\u06FF_]+/g, "")
        .toLowerCase();
    return slug || fallback;
}

function setStatus(element, message = "", type = "") {
    if (!element) return;
    element.classList.remove("error", "success");
    if (!message) {
        element.classList.add("hidden");
        element.textContent = "";
        return;
    }
    if (type) {
        element.classList.add(type);
    }
    element.classList.remove("hidden");
    element.textContent = message;
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function renderIconGrid(filter = "") {
    iconGridEl.innerHTML = "";
    const query = filter.trim().toLowerCase();
    Object.entries(iconLibrary).forEach(([key, icon]) => {
        if (query && !icon.name.toLowerCase().includes(query) && !key.toLowerCase().includes(query)) {
            return;
        }
        const card = document.createElement("div");
        card.className = "icon-card";
        card.innerHTML = `${icon.svg}<span>${icon.name}</span>`;
        if (!icon.builtIn) {
            const removeBtn = document.createElement("button");
            removeBtn.className = "icon-remove";
            removeBtn.textContent = "✕";
            removeBtn.title = "حذف";
            removeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                delete iconLibrary[key];
                state.icons = iconLibrary;
                renderIconGrid(iconSearchEl.value);
                renderRowList();
            });
            card.appendChild(removeBtn);
        }
        card.addEventListener("click", () => {
            // no-op here; selection handled per-row picker
        });
    iconGridEl.appendChild(card);
});
}

function renderRowList() {
    rowListEl.innerHTML = "";
    rows.forEach((row, index) => {
        const card = document.createElement("div");
        card.className = "row-card";
        const slug = slugify(row.label, `row${index + 1}`);

        const rowTop = document.createElement("div");
        rowTop.className = "row-top";

        const labelField = document.createElement("div");
        labelField.className = "field-row compact";
        const labelLabel = document.createElement("label");
        labelLabel.textContent = "متن دکمه";
        const labelInput = document.createElement("input");
        labelInput.className = "row-label";
        labelInput.value = row.label;
        labelInput.placeholder = "نام روی دکمه";
        labelInput.addEventListener("input", (e) => {
            row.label = e.target.value;
            state.rows = rows;
            renderRowValues();
        });
        labelField.appendChild(labelLabel);
        labelField.appendChild(labelInput);

        const typeField = document.createElement("div");
        typeField.className = "field-row compact";
        const typeLabel = document.createElement("label");
        typeLabel.textContent = "نوع";
        const typeSelect = document.createElement("select");
        typeSelect.className = "row-type";
        ["phone", "email", "link"].forEach((type) => {
            const opt = document.createElement("option");
            opt.value = type;
            opt.textContent = type === "phone" ? "تلفن" : type === "email" ? "ایمیل" : "لینک";
            if (type === row.type) opt.selected = true;
            typeSelect.appendChild(opt);
        });
        typeSelect.addEventListener("change", (e) => {
            row.type = e.target.value;
            state.rows = rows;
            renderRowValues();
        });
        typeField.appendChild(typeLabel);
        typeField.appendChild(typeSelect);

        const iconField = document.createElement("div");
        iconField.className = "field-row compact";
        const iconLabel = document.createElement("label");
        iconLabel.textContent = "آیکن";
        const iconPicker = document.createElement("div");
        iconPicker.className = "icon-picker";
        const iconButton = document.createElement("button");
        iconButton.type = "button";
        iconButton.className = "icon-picker-btn";
        iconButton.innerHTML = `${iconLibrary[row.icon]?.svg || ""}<span>${iconLibrary[row.icon]?.name || "آیکن"}</span>`;

        const iconMenu = document.createElement("div");
        iconMenu.className = "icon-menu hidden";
        const iconSearch = document.createElement("input");
        iconSearch.type = "search";
        iconSearch.placeholder = "جستجوی آیکن";
        iconSearch.className = "icon-menu-search";
        iconMenu.appendChild(iconSearch);

        const iconMenuList = document.createElement("div");
        iconMenuList.className = "icon-menu-list";
        iconMenu.appendChild(iconMenuList);

        function renderIconMenu(filter = "") {
            iconMenuList.innerHTML = "";
            const query = filter.trim().toLowerCase();
            Object.entries(iconLibrary).forEach(([key, icon]) => {
                if (query && !icon.name.toLowerCase().includes(query) && !key.toLowerCase().includes(query)) {
                    return;
                }
                const item = document.createElement("button");
                item.type = "button";
                item.className = "icon-menu-item";
                if (row.icon === key) {
                    item.classList.add("selected");
                }
                item.innerHTML = `${icon.svg}<span>${icon.name}</span>`;
                item.addEventListener("click", () => {
                    row.icon = key;
                    state.rows = rows;
                    iconButton.innerHTML = `${icon.svg}<span>${icon.name}</span>`;
                    iconMenu.classList.add("hidden");
                });
                iconMenuList.appendChild(item);
            });
        }

        iconButton.addEventListener("click", (e) => {
            e.stopPropagation();
            renderIconMenu();
            iconMenu.classList.toggle("hidden");
        });

        document.addEventListener("click", () => {
            iconMenu.classList.add("hidden");
        });

        iconMenu.addEventListener("click", (e) => e.stopPropagation());
        iconSearch.addEventListener("input", (e) => renderIconMenu(e.target.value));
        renderIconMenu();

        iconPicker.appendChild(iconButton);
        iconPicker.appendChild(iconMenu);
        iconField.appendChild(iconLabel);
        iconField.appendChild(iconPicker);

        const actions = document.createElement("div");
        actions.className = "row-actions";

        const upBtn = document.createElement("button");
        upBtn.textContent = "▲";
        upBtn.title = "بالا";
        upBtn.disabled = index === 0;
        upBtn.addEventListener("click", () => moveRow(index, -1));

        const downBtn = document.createElement("button");
        downBtn.textContent = "▼";
        downBtn.title = "پایین";
        downBtn.disabled = index === rows.length - 1;
        downBtn.addEventListener("click", () => moveRow(index, 1));

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✕";
        removeBtn.title = "حذف";
        removeBtn.addEventListener("click", () => removeRow(index));

        actions.appendChild(upBtn);
        actions.appendChild(downBtn);
        actions.appendChild(removeBtn);

        rowTop.appendChild(labelField);
        rowTop.appendChild(typeField);
        rowTop.appendChild(iconField);
        rowTop.appendChild(actions);

        const rowBottom = document.createElement("div");
        rowBottom.className = "row-bottom";
        const slugText = document.createElement("span");
        slugText.className = "muted";
        slugText.textContent = `نام ستون: ${slug}`;
        rowBottom.appendChild(slugText);

        card.appendChild(rowTop);
        card.appendChild(rowBottom);
        rowListEl.appendChild(card);
    });
}

function renderRowValues() {
    singleRowValuesEl.innerHTML = "";
    rows.forEach((row, index) => {
        const slug = slugify(row.label, `row${index + 1}`);
        const item = document.createElement("div");
        item.className = "row-value-item";

        const label = document.createElement("label");
        label.textContent = `(${row.type === "link" ? "لینک" : row.type === "email" ? "ایمیل" : "تلفن"}) ${row.label || slug}`;

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = row.type === "link" ? "https://example.com" : row.type === "email" ? "email@example.com" : "09123456789";
        if (row.type !== "link") {
            input.dir = "ltr";
        }
        if (state.data.single.rowValues[slug]) {
            input.value = state.data.single.rowValues[slug];
        }
        input.addEventListener("input", (e) => {
            state.data.single.rowValues[slug] = e.target.value;
        });

        item.appendChild(label);
        item.appendChild(input);
        singleRowValuesEl.appendChild(item);
    });
}

function moveRow(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const [row] = rows.splice(index, 1);
    rows.splice(target, 0, row);
    state.rows = rows;
    renderRowList();
    renderRowValues();
}

function removeRow(index) {
    rows.splice(index, 1);
    state.rows = rows;
    renderRowList();
    renderRowValues();
}

function addRow() {
    rows.push({
        id: rowIdCounter++,
        label: "ردیف جدید",
        type: "link",
        icon: Object.keys(iconLibrary)[0] || "link"
    });
    state.rows = rows;
    renderRowList();
    renderRowValues();
}

addRowBtn.addEventListener("click", addRow);

iconSearchEl.addEventListener("input", (e) => {
    renderIconGrid(e.target.value);
});

addIconBtn.addEventListener("click", () => {
    const name = iconNameEl.value.trim();
    const svg = customSvgEl.value.trim();
    if (!name || !svg) return;
    const key = slugify(name, `icon${Object.keys(iconLibrary).length + 1}`);
    iconLibrary[key] = { name, svg, builtIn: false };
    state.icons = iconLibrary;
    iconNameEl.value = "";
    customSvgEl.value = "";
    renderIconGrid(iconSearchEl.value);
    renderRowList();
});

fontSelectEl.addEventListener("change", (e) => {
    if (e.target.value === "Custom") {
        customFontField.classList.remove("hidden");
    } else {
        customFontField.classList.add("hidden");
    }
    state.theme.font = e.target.value;
});

document.getElementById("custom-font").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    state.theme.fontFile = file || null;
});

function toggleAccentFields(style) {
    if (style === "gradient") {
        accentGradientField.classList.remove("hidden");
        accentSolidField.classList.add("hidden");
    } else {
        accentGradientField.classList.add("hidden");
        accentSolidField.classList.remove("hidden");
    }
}

accentStyleEl.addEventListener("change", (e) => toggleAccentFields(e.target.value));
toggleAccentFields(accentStyleEl.value);

const defaultColors = {
    accent: "#2e7bc8",
    solid: "#2e7bc8",
    lightTitle: "#444444",
    lightSub: "#666666",
    darkTitle: "#ffffff",
    darkSub: "#cccccc",
    pageBg: "#f6f6f7",
    cardBg: "#ffffff",
    defaultMode: "dark"
};

function updateColorDisplay(inputEl) {
    const chip = document.querySelector(`[data-color-display="${inputEl.id}"]`);
    if (chip) {
        chip.textContent = inputEl.value;
    }
}

const colorInputs = [
    accentColorEl,
    solidColorEl,
    lightTitleEl,
    lightSubEl,
    darkTitleEl,
    darkSubEl,
    pageBgEl,
    cardBgEl
];

colorInputs.forEach((input) => {
    input.addEventListener("input", (e) => updateColorDisplay(e.target));
    updateColorDisplay(input);
});

accentStyleEl.addEventListener("change", (e) => {
    state.theme.accent.style = e.target.value;
});

accentColorEl.addEventListener("input", (e) => {
    state.theme.accent.color = e.target.value;
});

solidColorEl.addEventListener("input", (e) => {
    state.theme.accent.solidColor = e.target.value;
});

lightTitleEl.addEventListener("input", (e) => {
    state.theme.text.light.title = e.target.value;
});

lightSubEl.addEventListener("input", (e) => {
    state.theme.text.light.subtitle = e.target.value;
});

darkTitleEl.addEventListener("input", (e) => {
    state.theme.text.dark.title = e.target.value;
});

darkSubEl.addEventListener("input", (e) => {
    state.theme.text.dark.subtitle = e.target.value;
});

pageBgEl.addEventListener("input", (e) => {
    state.theme.background.light.page = e.target.value;
});

cardBgEl.addEventListener("input", (e) => {
    state.theme.background.light.card = e.target.value;
});

defaultModeEls.forEach((el) => {
    el.addEventListener("change", () => {
        const checked = Array.from(defaultModeEls).find((input) => input.checked);
        if (checked) {
            state.theme.defaultMode = checked.value;
        }
    });
});

resetColorsBtn.addEventListener("click", () => {
    accentColorEl.value = defaultColors.accent;
    solidColorEl.value = defaultColors.solid;
    lightTitleEl.value = defaultColors.lightTitle;
    lightSubEl.value = defaultColors.lightSub;
    darkTitleEl.value = defaultColors.darkTitle;
    darkSubEl.value = defaultColors.darkSub;
    pageBgEl.value = defaultColors.pageBg;
    cardBgEl.value = defaultColors.cardBg;
    defaultModeEls.forEach((el) => {
        el.checked = el.value === defaultColors.defaultMode;
    });
    toggleAccentFields(accentStyleEl.value);
    colorInputs.forEach(updateColorDisplay);
    state.theme.accent.color = defaultColors.accent;
    state.theme.accent.solidColor = defaultColors.solid;
    state.theme.text.light.title = defaultColors.lightTitle;
    state.theme.text.light.subtitle = defaultColors.lightSub;
    state.theme.text.dark.title = defaultColors.darkTitle;
    state.theme.text.dark.subtitle = defaultColors.darkSub;
    state.theme.background.light.page = defaultColors.pageBg;
    state.theme.background.light.card = defaultColors.cardBg;
    state.theme.defaultMode = defaultColors.defaultMode;
});

function updateBatchSummary() {
    const peopleCount = state.data.batch.people.length;
    const imagesCount = state.data.batch.images.length;
    const parts = [];
    if (peopleCount) parts.push(`تعداد رکوردهای بارگذاری شده: ${peopleCount}`);
    if (imagesCount) parts.push(`تعداد تصاویر انتخاب‌شده: ${imagesCount}`);
    const message = parts.join(" | ");
    setStatus(batchSummaryEl, message, peopleCount ? "success" : "");
    if (state.data.batch.warnings.length) {
        setStatus(batchWarningsEl, state.data.batch.warnings.join(" | "), "error");
    } else {
        setStatus(batchWarningsEl, "");
    }
}

async function downloadTemplate() {
    if (!templateBtn) return;
    templateBtn.disabled = true;
    setStatus(batchWarningsEl, "");
    try {
        const res = await fetch("/api/template", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rows: state.rows }),
        });
        if (!res.ok) {
            setStatus(batchWarningsEl, "خطا در ساخت فایل نمونه.", "error");
            return;
        }
        const blob = await res.blob();
        downloadBlob(blob, "sample.xlsx");
    } catch (err) {
        setStatus(batchWarningsEl, "اتصال به سرور برقرار نشد.", "error");
    } finally {
        templateBtn.disabled = false;
    }
}

async function importXlsxFile(file) {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("rows", JSON.stringify(state.rows));
    setStatus(batchWarningsEl, "");
    setStatus(batchSummaryEl, "در حال پردازش فایل...", "");
    try {
        const res = await fetch("/api/import", {
            method: "POST",
            body: formData,
        });
        if (!res.ok) {
            setStatus(batchWarningsEl, "خطا در خواندن فایل اکسل.", "error");
            return;
        }
        const payload = await res.json();
        state.data.batch.people = payload.people || [];
        state.data.batch.warnings = payload.warnings || [];
        updateBatchSummary();
    } catch (err) {
        setStatus(batchWarningsEl, "خطا در پردازش فایل اکسل.", "error");
    }
}

function handleImagesSelection(files) {
    state.data.batch.images = Array.from(files || []);
    updateBatchSummary();
}

function buildPayload() {
    const theme = {
        ...state.theme,
        fontFile: state.theme.font === "Custom" && state.theme.fontFile ? state.theme.fontFile.name : null,
    };
    const singleData = {
        name: state.data.single.name,
        subtitle1: state.data.single.subtitle1,
        subtitle2: state.data.single.subtitle2,
        rowValues: state.data.single.rowValues,
        profileImageFile: state.data.single.profileFile ? state.data.single.profileFile.name : null,
    };
    return {
        mode: state.mode,
        rows: state.rows,
        icons: state.icons,
        theme,
        data: {
            single: singleData,
            batch: state.data.batch.people,
        },
    };
}

async function runExport() {
    setStatus(exportWarningsEl, "");
    const payload = buildPayload();
    if (payload.mode === "batch" && (!payload.data.batch || payload.data.batch.length === 0)) {
        setStatus(exportWarningsEl, "ابتدا فایل اکسل را بارگذاری کنید.", "error");
        return;
    }
    if (state.theme.font === "Custom" && !state.theme.fontFile) {
        setStatus(exportWarningsEl, "برای فونت سفارشی، فایل فونت را انتخاب کنید.", "error");
        return;
    }
    if (exportBtn) exportBtn.disabled = true;
    if (zipBtn) zipBtn.disabled = true;
    try {
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload));
        if (payload.mode === "single" && state.data.single.profileFile) {
            formData.append("profile", state.data.single.profileFile, state.data.single.profileFile.name);
        }
        if (payload.mode === "batch" && state.data.batch.images.length) {
            state.data.batch.images.forEach((file) => {
                const name = file.webkitRelativePath ? file.webkitRelativePath.split("/").pop() : file.name;
                formData.append("images", file, name);
            });
        }
        if (state.theme.font === "Custom" && state.theme.fontFile) {
            formData.append("font", state.theme.fontFile, state.theme.fontFile.name);
        }
        const res = await fetch("/api/export", {
            method: "POST",
            body: formData,
        });
        if (!res.ok) {
            setStatus(exportWarningsEl, "خطا در ساخت خروجی.", "error");
            return;
        }
        const warningsHeader = res.headers.get("X-Export-Warnings");
        const blob = await res.blob();
        downloadBlob(blob, "export.zip");

        if (warningsHeader) {
            try {
                const warnings = JSON.parse(warningsHeader);
                if (warnings.length) {
                    setStatus(exportWarningsEl, `تصاویر یافت نشد: ${warnings.join(" | ")}`, "error");
                } else {
                    setStatus(exportWarningsEl, "خروجی با موفقیت ساخته شد.", "success");
                }
            } catch {
                setStatus(exportWarningsEl, "خروجی ساخته شد.", "success");
            }
        } else {
            setStatus(exportWarningsEl, "خروجی با موفقیت ساخته شد.", "success");
        }
    } catch (err) {
        setStatus(exportWarningsEl, "خطای ارتباط با سرور.", "error");
    } finally {
        if (exportBtn) exportBtn.disabled = false;
        if (zipBtn) zipBtn.disabled = false;
    }
}

function initUI() {
    state.rows = rows;
    state.icons = iconLibrary;
    state.mode = "single";
    state.theme.defaultMode = "dark";
    state.theme.accent.style = accentStyleEl.value;
    state.theme.accent.color = accentColorEl.value;
    state.theme.accent.solidColor = solidColorEl.value;
    setMode(state.mode);
    modeInputs.forEach((input) => {
        input.addEventListener("change", (event) => setMode(event.target.value));
    });

    nameEl.addEventListener("input", (e) => {
        state.data.single.name = e.target.value;
    });

    subtitle1El.addEventListener("input", (e) => {
        state.data.single.subtitle1 = e.target.value;
    });

    subtitle2El.addEventListener("input", (e) => {
        state.data.single.subtitle2 = e.target.value;
    });

    profileEl.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        state.data.single.profileFile = file || null;
    });

    if (templateBtn) {
        templateBtn.addEventListener("click", downloadTemplate);
    }
    if (xlsxInput) {
        xlsxInput.addEventListener("change", (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) importXlsxFile(file);
        });
    }
    if (imagesFolderInput) {
        imagesFolderInput.addEventListener("change", (e) => {
            handleImagesSelection(e.target.files);
        });
    }
    if (exportBtn) {
        exportBtn.addEventListener("click", runExport);
    }
    if (zipBtn) {
        zipBtn.addEventListener("click", runExport);
    }

    renderIconGrid();
    renderRowList();
    renderRowValues();
    updateBatchSummary();
}

window.addEventListener("DOMContentLoaded", initUI);
