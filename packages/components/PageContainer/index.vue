<script setup lang="ts">
import { ElBacktop, ElContainer, ElFooter, ElHeader, ElMain, ElScrollbar } from 'element-plus'
import { computed, useSlots } from 'vue'

const slots = useSlots()

const hasFooter = computed(() => {
  return Object.keys(slots).includes('footer')
})
</script>

<template>
  <ElContainer class="base-container">
    <ElHeader class="header-wrap bg-white-d">
      <slot name="header" />
    </ElHeader>
    <ElMain class="main-wrap !p-0">
      <ElScrollbar>
        <ElBacktop
          :style="{ bottom: hasFooter ? '52px' : '40px' }"
          title="回到顶部"
          target=".main-wrap .el-scrollbar__wrap"
        >
          <img src="./back_top.svg">
        </ElBacktop>
        <div class="p-4">
          <slot />
        </div>
      </ElScrollbar>
    </ElMain>
    <ElFooter
      class="footer-wrap bg-white-d"
      :style="{ height: hasFooter ? '48px' : '0' }"
    >
      <slot name="footer" />
    </ElFooter>
  </ElContainer>
</template>

<style lang="scss" scoped>
.main-content {
  margin: 0 !important;
  min-width: 0;
}

.base-container {
  height: calc(100vh - 88px);

  .header-wrap {
    height: auto;
    padding: 0 1rem;
    box-shadow: 0 2px 6px -1px rgb(0 0 0 / 0.1);
    z-index: 980;
  }

  .main-wrap {
    min-width: 1000px;
  }

  .footer-wrap {
    min-width: 500px;
    padding: 0 1rem;
    box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1);
    z-index: 980;
  }
}

.dark {
  .header-wrap {
    box-shadow: 0 5px 6px -1px rgb(0 0 0 / 0.3);
  }

  .footer-wrap {
    box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.3);
  }
}
</style>
