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

<script lang="ts" setup>
const PAGE_TITLE = "CPS测试 | kirisauce";

useHead({
    title: PAGE_TITLE,
    meta: [
        {
            name: "keywords",
            content: "CPS测试, 在线, 鼠标点击速度测试, CPS test",
        },
        {
            property: 'og:description',
            content: '测试您的鼠标点击速度。',
        },
        {
            property: "og:title",
            content: PAGE_TITLE,
        },
        {
            property: "og:type",
            content: "website",
        },
    ],
});

const modes = [
    {
        id: "click",
        label: "click事件 (通用)",
    },
    {
        id: "touch",
        label: "touch事件 (支持多点同时点击)",
    },
    {
        id: "mouse",
        label: "mouse事件 (推荐鼠标使用)",
    },
];
const mode = persistentValue("cps.mode", () => modes[0].id);
const canBeTerminated = persistentValue(
    "cps.canBeTerminated",
    () => true,
    booleanDeserializer,
);
const totalSecs = persistentValue("cps.totalSecs", () => 10, Number);
const overlayEnabled = ref(false);
const count = ref(0);
const stopAt = ref(new Date());
const remainingSecs = ref(0.0);
const progress = ref(0.0);
const cps = ref(0.0);
const isFirstClick = ref(true);

const progressUpdater = ref(null);

const showOptions = ref(false);

function getRemainingSecs(): float {
    let now = new Date();

    if (now >= stopAt.value) {
        return 0.0;
    } else {
        return ((stopAt.value - now) as float) / 1000.0;
    }
}

// 进度
function getProgress(): float {
    return (remainingSecs.value / totalSecs.value) * 100.0;
}

// CPS
function getCps(): float {
    return (count.value as float) / (totalSecs.value - remainingSecs.value);
}

function killNonNull(interval) {
    if (interval != null) {
        clearInterval(interval);
    }
}

// 中止测试
function stopTest(e: event | null) {
    if (e != null) {
        e.stopPropagation();
    }

    killNonNull(progressUpdater.value);

    overlayEnabled.value = false;
}

function prepareTest(e: event) {
    overlayEnabled.value = true;
    count.value = 0;
    cps.value = 0.0;
    progress.value = 0.0;
    isFirstClick.value = true;
    remainingSecs.value = totalSecs.value;

    setTimeout(() => {
        progress.value = 100.0;
    }, 100);
}

function startTest(e: event) {
    e.stopPropagation();

    killNonNull(progressUpdater.value);

    progressUpdater.value = setInterval(() => {
        remainingSecs.value = getRemainingSecs();
        progress.value = getProgress();
        cps.value = getCps();

        if (remainingSecs.value <= 0.0) {
            stopTest(null);
        }
    }, 50);

    let now = new Date();
    now.setSeconds(now.getSeconds() + totalSecs.value);
    stopAt.value = now;
}

function addValueCallback(e: event) {
    count.value += 1;
}

function wrapCallback(
    modeFilter: string,
    callback: (event) => void,
): (event) => void {
    return (e: event) => {
        if (overlayEnabled.value && mode.value === modeFilter) {
            e.preventDefault();
            e.stopPropagation();

            if (isFirstClick.value) {
                startTest(e);
                isFirstClick.value = false;
            }

            callback(e);
        }
    };
}

// 监听目标事件
onMounted(() => {
    let target = document.querySelector("#overlay");
    target.addEventListener("click", wrapCallback("click", addValueCallback));
    target.addEventListener(
        "touchstart",
        wrapCallback("touch", addValueCallback),
    );
    target.addEventListener(
        "mousedown",
        wrapCallback("mouse", addValueCallback),
    );
});
</script>

<template>
    <Transition name="overlay">
        <div id="overlay" class="flex-column" v-show="overlayEnabled">
            <div id="stopButton">
                <UButton
                    label="中止"
                    color="red"
                    variant="solid"
                    v-show="canBeTerminated || isFirstClick"
                    @click="stopTest"
                    @mousedown="(e) => e.stopPropagation()"
                    @touchstart="(e) => e.stopPropagation()"
                />
            </div>

            <div id="progress">
                <p>{{ formatFloat(remainingSecs, 3) }} 秒</p>
                <UProgress :value="progress" />
            </div>
        </div>
    </Transition>

    <div id="mainContainer" class="flex-column">
        <Transition name="utils">
            <div id="utilsOuterContainer" v-show="!overlayEnabled">
                <div id="utilsContainer" class="w-full h-full">
                    <div id="startButton">
                        <UButton
                            label="启动！"
                            variant="outline"
                            color="lime"
                            @click="prepareTest"
                            size="xl"
                            block
                        />
                    </div>
                    <div id="optionsButton">
                        <UButton
                            icon="heroicons:adjustments-horizontal"
                            variant="outline"
                            color="sky"
                            @click="showOptions = true"
                            size="xl"
                            block
                        />
                    </div>
                </div>
            </div>
        </Transition>

        <div id="informationContainer" class="flex-column">
            <div id="information"></div>
            <p>点击次数: {{ count }}</p>
            <p>CPS: {{ formatFloat(cps, 2) }}</p>
            <p v-show="isFirstClick && overlayEnabled">点击屏幕开始测试</p>
        </div>
    </div>

    <UModal v-model="showOptions">
        <UCard>
            <template #header>
                <h2>选项</h2>
            </template>

            检测方式
            <USelectMenu
                v-model="mode"
                :options="modes"
                value-attribute="id"
                option-attribute="label"
            ></USelectMenu>

            <br />

            时间(秒)
            <UInput
                v-model="totalSecs"
                type="number"
                placeholder="在此输入时间..."
            />

            <br />

            显示中止按钮
            <UToggle v-model="canBeTerminated"></UToggle>
        </UCard>
    </UModal>
</template>

<style scope>
.flex-column {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#overlay {
    position: absolute;

    background-color: #00000000;
    justify-content: space-between;

    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 3;
}

#overlay #stopButton {
    padding-top: 25px;
    user-select: none;
}

#overlay #progress {
    padding-bottom: 25px;
    width: 90%;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 450ms;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

.utils-enter-active#utilsOuterContainer,
.utils-leave-active#utilsOuterContainer {
    transition:
        transform 500ms,
        height 500ms;
}

.utils-enter-from#utilsOuterContainer,
.utils-leave-to#utilsOuterContainer {
    height: 0;
    transform: translateY(-10vh);
}

.utils-enter-to#utilsOuterContainer,
.utils-leave-from#utilsOuterContainer {
    transform: translateY(0);
}

#mainContainer {
    position: absolute;
    justify-items: flex-start;
    width: 100%;
    height: 100%;
}

#utilsOuterContainer {
    height: 2rem;
    align-self: stretch;
    display: block;
}

#utilsContainer {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
}

#utilsContainer > #startButton {
    width: 80%;
}

#utilsContainer > #optionsButton {
    width: 20%;
}

#informationContainer {
    width: 100%;
    height: 90%;
    justify-content: center;
}

#informationContainer #information {
    width: 50%;
}
</style>
