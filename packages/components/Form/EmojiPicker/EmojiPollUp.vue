<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import EmojiData from './assets/emojidata/emoji-data.json'
import SizeData from './assets/options/SizeData.json'
import ThemeData from './assets/options/ThemeData.json'
import { saveToLocal } from './utils/commonUtils'
import { filterData } from './utils/emojiFilter'
import { getItem, removeItem, setItem } from './utils/storage'
import './assets/styles/V3Emoji.scss'

const props = defineProps<{
  size: string
  theme: 'dark' | 'default'
  skin: 'dark' | 'middark' | 'mid' | 'midlight' | 'light' | 'none'
  disableGroup?: string[]
  optionsName?: Emoji.JsonData
  unicodeVersion?: number
  needLocal?: boolean
  defaultSelect?: string
  customSize?: Emoji.CustomSize
  customIcon?: Emoji.CustomIcon
  customTheme?: Emoji.CustomTheme
  customTab?: Emoji.JsonData
  fixPos?: Emoji.FixType
}>()
const emit = defineEmits(['clickEmoji', 'clear'])
const Skin: Emoji.JsonData = {
  dark: '&#127999;',
  middark: '&#127998;',
  mid: '&#127997;',
  midlight: '&#127996;',
  light: '&#127995;',
  none: '',
}
const emojiData: Emoji.JsonData = EmojiData
const sizeData: Emoji.JsonData = SizeData
const themeData: Emoji.JsonData = ThemeData
const activeTab = ref('Smileys & Emotion')
const pollUpEl = ref<HTMLElement>()
const renderData = filterData(
  emojiData,
  props.optionsName,
  props.unicodeVersion,
  props.disableGroup,
  props.customTab,
)
const recentData = ref<Emoji.ObjectItem>(getItem('emoji-recent') || null)
const groupName: string[] = []
// 过滤皮肤选项
const emojiSkin = (emoji: Emoji.EmojiItem) => {
  if (!emoji.skin_tone_support) {
    return emoji.emoji
  } else {
    if (!emoji.skin_tone_support_unicode_version) {
      return emoji.emoji
    } else {
      const skin = Number.parseInt(emoji.skin_tone_support_unicode_version) < 10 ? Skin[props.skin] : ''
      return `${emoji.emoji}${skin}`
    }
  }
}
// 初始化pollup所需的数据
const initPollup = () => {
  for (const key in renderData) {
    groupName.push(key)
  }
  // 初始化最近使用的数据
  if (recentData.value === null && props.needLocal) {
    recentData.value = {
      recent: [],
    }
    setItem('emoji-recent', recentData.value)
  }
  if (props.defaultSelect && (groupName.includes(props.defaultSelect) || (props.defaultSelect === 'recent' && props.needLocal))) {
    activeTab.value = props.defaultSelect
  } else {
    activeTab.value = groupName[0]
  }
}
// 切换tab
const changeTab = (tab: string) => {
  activeTab.value = tab
}
// 点击表情
const clickEmoji = (emoji: Emoji.EmojiItem) => {
  // 增加一个最近使用的选项 来自本地存储
  if (props.needLocal) {
    saveToLocal(recentData, emoji)
  }
  emit('clickEmoji', emoji)
}
// 删除所有最近使用过的emoji
const deleteRecent = () => {
  recentData.value.recent = []
  removeItem('emoji-recent')
}
// 改变位置
const changePos = () => {
  if (pollUpEl.value && !props.fixPos) {
    // 这里就是打开弹出层 如果检测到上方空间不够 那就移动到下面
    if (pollUpEl.value.getBoundingClientRect().top < 0) {
      pollUpEl.value.style.bottom = 'unset'
      pollUpEl.value.style.top = '50px'
    }
    // 如果检测到左边空间不够 那就移动到右边 如果空间不足则不移动
    if (pollUpEl.value.getBoundingClientRect().left < 0) {
      pollUpEl.value.style.left = '0'
      pollUpEl.value.style.right = 'unset'
    }
  } else if (pollUpEl.value) {
    switch (props.fixPos) {
      case 'upcenter':
        pollUpEl.value.style.left = 'unset'
        pollUpEl.value.style.right = 'unset'
        pollUpEl.value.style.transform = 'translateX(-50%)'
        pollUpEl.value.style.bottom = '50px'
        pollUpEl.value.style.top = 'unset'
        break
      case 'downcenter':
        pollUpEl.value.style.left = 'unset'
        pollUpEl.value.style.right = 'unset'
        pollUpEl.value.style.transform = 'translateX(-50%)'
        pollUpEl.value.style.bottom = 'unset'
        pollUpEl.value.style.top = '50px'
        break
      case 'downleft':
        pollUpEl.value.style.right = '0'
        pollUpEl.value.style.left = 'unset'
        pollUpEl.value.style.bottom = 'unset'
        pollUpEl.value.style.top = '50px'
        break
      case 'downright':
        pollUpEl.value.style.right = 'unset'
        pollUpEl.value.style.left = '0'
        pollUpEl.value.style.bottom = 'unset'
        pollUpEl.value.style.top = '50px'
        break
      case 'upleft':
        pollUpEl.value.style.bottom = '50px'
        pollUpEl.value.style.top = 'unset'
        pollUpEl.value.style.right = '0'
        pollUpEl.value.style.left = 'unset'
        break
      case 'upright':
        pollUpEl.value.style.bottom = '50px'
        pollUpEl.value.style.top = 'unset'
        pollUpEl.value.style.right = 'unset'
        pollUpEl.value.style.left = '0'
        break
      default:
        break
    }
  }
}
// 设置pollup弹出框的大小
const setSize = () => {
  if (pollUpEl.value) {
    if (props.customSize) {
      for (const key in sizeData[props.size]) {
        if (props.customSize[key]) {
          pollUpEl.value.style.setProperty(`--${key}`, props.customSize[key])
        } else {
          pollUpEl.value.style.setProperty(`--${key}`, sizeData[props.size][key])
        }
      }
    } else {
      for (const key in sizeData[props.size]) {
        pollUpEl.value.style.setProperty(`--${key}`, sizeData[props.size][key])
      }
    }
  }
}
// 设置主题
const setTheme = () => {
  if (pollUpEl.value) {
    if (props.customTheme) {
      for (const key in themeData[props.theme]) {
        if (props.customTheme[key]) {
          pollUpEl.value.style.setProperty(`--${key}`, props.customTheme[key])
        } else {
          pollUpEl.value.style.setProperty(`--${key}`, themeData[props.theme][key])
        }
      }
    } else {
      for (const key in themeData[props.theme]) {
        pollUpEl.value.style.setProperty(
          `--${key}`,
          themeData[props.theme][key],
        )
      }
    }
  }
}
// props改变了 就进行重新渲染
initPollup()
watchEffect(() => {
  setSize()
  setTheme()
})
onMounted(() => {
  setSize()
  setTheme()
  changePos()
  if (!props.fixPos) {
    document.addEventListener('scroll', changePos)
  }
})
onBeforeUnmount(() => {
  if (!props.fixPos) {
    document.removeEventListener('scroll', changePos)
  }
})
</script>

<template>
  <div ref="pollUpEl" class="pollup">
    <div v-if="activeTab === 'recent'" class="tab-name">
      <p mx-1>
        最近使用
      </p>
      <div cursor-pointer text-danger @click="deleteRecent">
        清空
      </div>
    </div>
    <p v-else class="tab-name">
      {{ activeTab }}
    </p>
    <div class="emoji-container">
      <template v-if="activeTab === 'recent'">
        <div
          v-for="(emoji, index) in recentData.recent"
          :key="index"
          class="emoji-container-item"
          :title="emoji.name"
          @click="clickEmoji(emoji)"
          v-html="emojiSkin(emoji)"
        />
      </template>
      <template v-else>
        <div
          v-for="(emoji, index) in renderData[activeTab]"
          :key="index"
          class="emoji-container-item"
          :title="emoji.name"
          @click="clickEmoji(emoji)"
          v-html="emojiSkin(emoji)"
        />
      </template>
    </div>
    <div class="tab-container">
      <!-- 最近使用过的的选项 -->
      <div
        v-if="needLocal"
        class="tab-item"
        :class="{ active: activeTab === 'recent' }"
        @click="changeTab('recent')"
      >
        🔥
      </div>
      <div
        v-for="tab in groupName"
        :key="tab"
        class="tab-item"
        :title="tab"
        :class="{ active: tab === activeTab }"
        @click="changeTab(tab)"
      >
        {{
          customIcon && customIcon[tab]
            ? customIcon[tab]
            : renderData[tab][0].emoji
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$padding: 10px;
$fontsize: var(--V3Emoji-fontSize);
$itemsize: var(--V3Emoji-itemSize);
$width: var(--V3Emoji-width);
$height: var(--V3Emoji-height);
$backgroundColor: var(--V3Emoji-backgroundColor);
$hoverColor: var(--V3Emoji-hoverColor);
$activeColor: var(--V3Emoji-activeColor);
$shadowColor: var(--V3Emoji-shadowColor);
$fontColor: var(--V3Emoji-fontColor);

.pollup {
  width: $width;
  height: $height;
  position: absolute;
  right: 0;
  bottom: 50px;
  z-index: 5;
  transition: all ease 0.5s;
  color: $fontColor;
  background-color: $backgroundColor;
  box-shadow: 3px 3px 10px $shadowColor;
  border-radius: 15px;
  overflow: hidden;

  .tab-name {
    font-size: $fontsize;
    height: $itemsize;
    margin: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .emoji-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, calc(var(--V3Emoji-itemSize) + 2 * $padding));
    justify-content: space-between;
    align-items: center;
    //计算出最大高度 根据tabname以及tab
    max-height: calc(var(--V3Emoji-height) - $itemsize * 2 - 2 * $padding - 10px);
    overflow-y: auto;

    &-item {
      padding: $padding;
      font-size: $fontsize;
      line-height: $itemsize;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: $hoverColor;
      }
    }
  }

  .tab-container {
    position: absolute;
    width: 100%;
    height: calc(var(--V3Emoji-itemsize) + 2 * $padding);
    overflow: auto;
    bottom: 0;
    display: flex;
    background-color: $backgroundColor;
    box-shadow: 3px 3px 10px $shadowColor;

    .tab-item {
      padding: $padding;
      font-size: $fontsize;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      &.active {
        background-color: $activeColor;
      }
    }
  }
}
</style>
