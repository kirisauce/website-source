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

<script setup lang="ts">
const {
    enabled = false,
    updateInterval = 10,
    idleUpdateInterval = 400,
} = defineProps<{
    enabled?: boolean;
    updateInterval?: number;
    idleUpdateInterval?: number;
}>();

/// 参数监听器s
const enabledReactor = (newValue, oldValue) => {
    if (newValue && !oldValue && !running) {
        updater();
    }
};
watch(() => enabled, enabledReactor);

const danmakuList = ref<array<PopupDanmaku>>([]);
let running = false;
const areaElement = ref<any>(null);

function getUniqueId() {
    return randint(1, 100000000);
}

interface PopupDanmakuConfig {
    x: number;
    y: number;
    content: string;
}

interface Size {
    width: number;
    height: number;
}

abstract class PopupDanmaku {
    public readonly config: PopupDanmakuConfig;
    public transitionName: string;
    public style: Object;
    public uniqueId: number;
    public createdAt: Date;
    public x: number;
    public y: number;

    public constructor(public readonly config: PopupDanmakuConfig) {
        this.uniqueId = getUniqueId();
        this.createdAt = new Date();
        this.transitionName = "danmakuDefault";
        this.x = config.x;
        this.y = config.y;
        this.style = {};

        this.updateStyle();
    }

    // 更新弹幕的样式
    public updateStyle() {
        this.style.left = `${this.x}px`;
        this.style.top = `${this.y}px`;
    }

    // 更新弹幕。该函数负责修改坐标并调用`updateStyle`更新坐标的样式表。
    //
    // 若该函数返回`false`则保留弹幕自身，否则更新器会将该弹幕删除。
    public abstract update(_now: Date, _rendererSize: Size): boolean;
}

class Bubble extends PopupDanmaku {
    public constructor(
        config: PopupDanmakuConfig,
        public speed: float,
    ) {
        super(config);
    }

    public update(now: Date, rendererSize: Size): boolean {
        let elapsed = (now - this.createdAt) as float;
        let elapsedRatio = (elapsed / 2000) * this.speed;

        this.y =
            this.config.y -
            elapsedRatio * elapsedRatio * rendererSize.height * 0.1;

        if (elapsedRatio >= 1) {
            return true;
        }

        this.updateStyle();
        this.style.opacity = `${elapsedRatio > 0.6 ? (1.0 - elapsedRatio) / 0.4 : 1.0}`;
        return false;
    }
}

// 弹幕更新器
const updater = () => {
    if (!enabled) {
        return;
    } else {
        running = true;
    }

    if (danmakuList.value.length == 0) {
        setTimeout(updater, idleUpdateInterval);
    } else {
        let now = new Date();
        let unneeded;
        let rendererSize = {
            width: areaElement.value.clientWidth,
            height: areaElement.value.clientHeight,
        };

        let newList = danmakuList.value.filter((d) => {
            let unneeded = d.update(now, rendererSize);

            return !unneeded;
        });

        danmakuList.value = newList;

        setTimeout(updater, updateInterval);
    }
};

function add(d: PopupDanmaku): number {
    danmakuList.value.push(d);
}

onMounted(() => {
    enabledReactor(enabled, false);
});

onUnmounted(() => {
    enabled = false;
});

defineExpose({
    add,
    danmakuList,
    Bubble,
});
</script>

<template>
    <div class="danmakuList" ref="areaElement">
        <Transition
            v-for="danmaku in danmakuList"
            :key="danmaku.uniqueId"
            :name="danmaku.transitionName"
        >
            <a class="danmaku" :style="danmaku.style"
                >{{ danmaku.config.content }}
            </a>
        </Transition>
    </div>
</template>

<style scope>
.danmakuList {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: block;
    background: transparent;
    z-index: -1;
}

.danmaku {
    position: absolute;
    display: block;
    background: transparent;
    transform: translate(-50%, -50%);
    z-index: -5;
}
</style>
