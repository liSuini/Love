export default {
  id: 'snake',
  name: '贪吃蛇对战',
  icon: '🐍',
  description: '双蛇同屏竞速，比比谁更长',
  component: () => import('./SnakeMode.vue'),
}
