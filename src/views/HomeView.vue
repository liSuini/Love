<template>
  <div class="home">
    <div class="topbar">
      <h1>💖 心动回合战</h1>
      <div class="topbar-right">
        <button class="btn-sm" @click="themeOpen = true">🎨 主题</button>
        <button class="btn-sm" @click="audioOpen = true">🔊 音频</button>
      </div>
    </div>
    <div class="home-body">
      <div class="home-title">心动回合战</div>
      <div class="home-sub">专属情侣的亲密互动游戏 · 多种玩法等你解锁</div>
      <div class="mode-grid">
        <ModeCard v-for="m in modes" :key="m.id" :mode="m" @select="goTo(m.id)" />
      </div>
      <div class="footer-hint">双人同屏轮流玩 · 请准备好你们的甜蜜时光</div>
    </div>
    <ThemeSwitcher :open="themeOpen" @close="themeOpen = false" />
    <AudioPanel :open="audioOpen" @close="audioOpen = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { modes } from '../modes/registry'
import ModeCard from '../components/ModeCard.vue'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import AudioPanel from '../components/AudioPanel.vue'

const router = useRouter()
const themeOpen = ref(false)
const audioOpen = ref(false)
function goTo(id) { router.push(`/game/${id}`) }
</script>

<style scoped>
.topbar { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; background: var(--c-card); box-shadow: var(--shadow); border-bottom: 1px solid var(--c-border); }
.topbar h1 { font-size: 20px; font-weight: 700; color: var(--c-primary); }
.topbar-right { display: flex; gap: 10px; }
.btn-sm { padding: 6px 14px; border: 1px solid var(--c-border); border-radius: 10px; background: transparent; color: var(--c-text); cursor: pointer; font-size: 13px; transition: all 0.2s; }
.btn-sm:hover { background: var(--c-primary); color: #fff; border-color: var(--c-primary); }
.home-body { max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center; }
.home-title { font-size: 32px; font-weight: 800; color: var(--c-primary); margin-bottom: 8px; }
.home-sub { font-size: 15px; color: var(--c-muted); margin-bottom: 36px; }
.mode-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.footer-hint { margin-top: 40px; font-size: 13px; color: var(--c-muted); }
</style>
