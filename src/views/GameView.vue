<template>
  <div class="game">
    <component v-if="asyncComponent" :is="asyncComponent" />
    <div v-else-if="!mode" class="not-found">
      <p>玩法不存在</p>
      <button @click="$router.push('/')">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getMode } from '../modes/registry'
const route = useRoute()
const mode = computed(() => getMode(route.params.modeId))
const asyncComponent = computed(() => {
  if (!mode.value) return null
  return defineAsyncComponent(mode.value.component)
})
</script>

<style scoped>
.game { padding: 0; max-width: 600px; margin: 0 auto; min-height: 100vh; }
.not-found { text-align: center; padding: 60px; }
.not-found p { font-size: 18px; margin-bottom: 20px; color: var(--c-muted); }
.not-found button { padding: 12px 28px; border-radius: 14px; border: none; background: var(--c-primary); color: #fff; font-size: 16px; cursor: pointer; }
</style>
