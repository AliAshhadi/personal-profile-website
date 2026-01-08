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

// Icon library data (fetched from backend)
const iconLibrary = {};

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

function setIconLibrary(icons = {}) {
    Object.keys(iconLibrary).forEach((key) => delete iconLibrary[key]);
    Object.entries(icons).forEach(([key, icon]) => {
        iconLibrary[key] = icon;
    });
    state.icons = iconLibrary;
}

async function loadIcons() {
    try {
        const res = await fetch("/api/icons");
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        setIconLibrary(data.icons || {});
    } catch (err) {
        console.error("خطا در دریافت آیکن‌ها", err);
    }
}

async function addIconRemote(name, svg) {
    const res = await fetch("/api/icons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, svg }),
    });
    if (!res.ok) {
        throw new Error("خطا در ذخیره آیکن");
    }
    const data = await res.json();
    setIconLibrary(data.icons || {});
}

async function deleteIconRemote(key) {
    const res = await fetch(`/api/icons/${encodeURIComponent(key)}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error("خطا در حذف آیکن");
    }
    const data = await res.json();
    setIconLibrary(data.icons || {});
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
            removeBtn.addEventListener("click", async (e) => {
                e.stopPropagation();
                try {
                    await deleteIconRemote(key);
                    renderIconGrid(iconSearchEl.value);
                    renderRowList();
                } catch (err) {
                    console.error(err);
                    alert("خطا در حذف آیکن");
                }
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

        card.appendChild(rowTop);
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

addIconBtn.addEventListener("click", async () => {
    const name = iconNameEl.value.trim();
    const svg = customSvgEl.value.trim();
    if (!name || !svg) return;
    addIconBtn.disabled = true;
    try {
        await addIconRemote(name, svg);
        iconNameEl.value = "";
        customSvgEl.value = "";
        renderIconGrid(iconSearchEl.value);
        renderRowList();
    } catch (err) {
        console.error(err);
        alert("خطا در ذخیره آیکن");
    } finally {
        addIconBtn.disabled = false;
    }
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

function getColorCodeInput(inputEl) {
    return document.querySelector(`[data-color-input="${inputEl.id}"]`);
}

function updateColorDisplay(inputEl) {
    const codeInput = getColorCodeInput(inputEl);
    if (codeInput) {
        codeInput.value = inputEl.value.toLowerCase();
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

function bindColorTextInputs() {
    colorInputs.forEach((colorInput) => {
        const codeInput = getColorCodeInput(colorInput);
        if (!codeInput) return;
        codeInput.addEventListener("input", (e) => {
            const raw = e.target.value.trim();
            const match = raw.match(/^#?[0-9a-fA-F]{6}$/);
            if (!match) return;
            const normalized = raw.startsWith("#") ? raw : `#${raw}`;
            colorInput.value = normalized;
            colorInput.dispatchEvent(new Event("input", { bubbles: true }));
        });
    });
}

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
    if (peopleCount) parts.push(`تعداد رکوردهای بارگذاری‌شده: ${peopleCount}`);
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
        setStatus(batchWarningsEl, "امکان اتصال به سرور وجود ندارد.", "error");
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
        setStatus(exportWarningsEl, "برای استفاده از فونت سفارشی، فایل فونت را انتخاب کنید.", "error");
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
                    setStatus(exportWarningsEl, `تصاویر یافت نشدند: ${warnings.join(" | ")}`, "error");
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

async function initUI() {
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

    await loadIcons();
    renderIconGrid();
    renderRowList();
    renderRowValues();
    bindColorTextInputs();
    updateBatchSummary();
}

window.addEventListener("DOMContentLoaded", () => {
    initUI();
});
