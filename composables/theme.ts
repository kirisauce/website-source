import { persistentValue } from "~/composables/storage.ts";

function getSystemTheme(): string {
    if (process.client) {
        let m = window.matchMedia("(prefers-color-scheme: dark)");

        if (m.matches) {
            alert("dark!");
            return "dark";
        } else {
            return "light";
        }
    } else {
        return "light";
    }
}

function getFinalTheme() {
    let preference = themePreference.value;

    if (preference == "system") {
        return systemTheme.value;
    } else if (preference == "dark") {
        return "dark";
    } else if (preference == "light") {
        return "light";
    }
}

const systemTheme = ref(getSystemTheme());

export const themePreference = persistentValue(
    "theme.preference",
    () => "system",
);
export const finalTheme = ref(getFinalTheme());

watch(themePreference, (newValue) => {
    finalTheme.value = getFinalTheme();
});

watch(systemTheme, (newValue) => {
    if (themePreference.value == "system") {
        finalTheme.value = newValue;
    }
});

if (process.client) {
    let m = window.matchMedia("(prefers-color-scheme: dark)");
    m.addEventListener("change", (e) => {
        systemTheme.value = getSystemTheme();
    });
}
