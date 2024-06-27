<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import './assets/styles/V3Emoji.scss'
import { onClickOutside } from '@vueuse/core'
import PollUp from './EmojiPollUp.vue'

const {
  size = 'mid',
  disableGroup = [],
  unicodeVersion = 11,
  theme = 'default',
  skin = 'none',
  recent = true,
  defaultSelect = 'recent',
  fulldata,
  keep,
  customSize,
  customTheme,
  customIcon,
  customTab,
  fixPos,
} = defineProps<{
  size?: 'mid' | 'small' | 'big' // 大小选项
  disableGroup?: string[] // 用于禁用部分组的 如果不需要自带的几个组 那就传进来
  unicodeVersion?: number // 用于unicode版本选择 部分设备无法兼容高版本的emojiunicode选项
  theme?: 'dark' | 'default' // 支持暗黑或者亮色主题
  skin?: 'dark' | 'middark' | 'mid' | 'midlight' | 'light' | 'none' // 用于设置emoji的肤色设置
  recent?: boolean // 是否需要最近使用过的emoji
  defaultSelect?: string // 默认选中某个板块
  fulldata?: boolean // 是否将整个emoji发送出去
  keep?: boolean // 是否需要保持上次浏览的位置
  customSize?: Emoji.CustomSize // 自定义大小
  customTheme?: Emoji.CustomTheme // 自定义主题
  customIcon?: Emoji.CustomIcon // 自定义图标
  customTab?: Emoji.ObjectItem // 支持自定义选择部分emoji单独设置一个板块
  fixPos?: Emoji.FixType // 固定位置 如果固定了位置 那么表情框只会在固定的位置 并不会随着页面的变化而改变位置
}>()

const emit = defineEmits<{
  change: [data: string | Emoji.EmojiItem]
  close: []
}>()

const modelValue = defineModel<string | Recordable>()

const optionsName = {
  'Smileys & Emotion': '笑脸&表情',
  'Food & Drink': '食物&饮料',
  'Animals & Nature': '动物&自然',
  'Travel & Places': '旅行&地点',
  'People & Body': '人物&身体',
  'Objects': '物品',
  'Symbols': '符号',
  'Flags': '旗帜',
  'Activities': '活动',
}

const emojiRel = ref()
const isPollupShow = ref(false)

const close = () => {
  isPollupShow.value = false
  emit('close')
}

const clear = () => {
  emit('change', fulldata ? null : '')
  modelValue.value = ''
  !keep && close()
}

onClickOutside(emojiRel, () => {
  close()
})

const change = (emoji: Emoji.EmojiItem) => {
  emit('change', fulldata ? emoji : emoji.emoji)
  modelValue.value = fulldata ? emoji : emoji.emoji
  !keep && close()
}
</script>

<template>
  <div ref="emojiRel" h-full>
    <div rel inline-flex>
      <div
        class="cursor-pointer text-5 flex-sc"
        @click="isPollupShow = !isPollupShow"
      >
        <slot>
          <div v-if="modelValue" flex-sc class="value-wrap">
            <div>{{ modelValue }}</div>
            <div i-ep-circle-close class="clear-icon hidden size-4 text-info" @click.stop="clear" />
          </div>
          <ElButton v-else type="primary" link>
            选择表情
          </ElButton>
        </slot>
      </div>
      <PollUp
        v-if="isPollupShow || keep"
        v-show="keep ? isPollupShow : true"
        :size="size"
        :theme="theme"
        :skin="skin"
        :disable-group="disableGroup"
        :options-name="optionsName"
        :unicode-version="unicodeVersion"
        :need-local="recent"
        :default-select="defaultSelect"
        :fulldata="fulldata"
        :custom-size="customSize"
        :custom-icon="customIcon"
        :custom-tab="customTab"
        :fix-pos="fixPos"
        :custom-theme="customTheme"
        @click-emoji="change"
        @clear="clear"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.value-wrap {
  &:hover {
    .clear-icon {
      display: block;
    }
  }
}
</style>
