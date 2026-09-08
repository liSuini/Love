export default {
  id: 'gomoku',
  name: '五子棋',
  icon: '♟️',
  description: '经典对弈，五子连珠即获胜',
  component: () => import('./GomokuMode.vue'),
}
