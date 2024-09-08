// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },

    meta: {
        meta: [
            { charset: "UTF-8" },
            { hid: "keywords", name: "keywords", content: "kirisauce" },
            {
                name: "viewport",
                content:
                    "width=device-width,maximum-scale=3.0,minimum-scale=1,initial-scale=1",
            },
        ],
    },

    ssr: true,
    target: 'static',

    modules: ["@nuxt/ui", "@nuxt/icon"],
});
