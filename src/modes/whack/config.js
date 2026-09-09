export default {
  id: 'whack',
  name: '打地鼠竞速',
  icon: '🔨',
  description: '60秒限时，比比谁手速更快',
  component: () => import('./WhackMode.vue'),
}
