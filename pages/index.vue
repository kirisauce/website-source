<!--
Copyright (c) 2024 kirisauce
kirisauce's website is licensed under Mulan PSL v2.
You can use this software according to the terms and conditions of the Mulan PSL v2.
You may obtain a copy of Mulan PSL v2 at:
         http://license.coscl.org.cn/MulanPSL2
THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
See the Mulan PSL v2 for more details.
-->

<template>
    <NuxtPage id="pageView" />
</template>

<script setup lang="ts">
useHead({
    meta: [
        {
            property: "og:locale",
            content: "zh_CN",
        },
    ],
});
</script>

<style>
body {
    width: 100%;
    min-height: 100%;

    background-color: var(--primary-key);
}

.darkMode {
    --primary-color: #374151;
}

.lightMode {
    --primary-color: #000000;
}
</style>
