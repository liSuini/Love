export default {
  id: 'tictactoe',
  name: '井字棋',
  icon: '⭕',
  description: '三连即胜，快速对局',
  component: () => import('./TictactoeMode.vue'),
}
