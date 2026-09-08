import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/game/:modeId', name: 'game', component: GameView },
  { path: '/:pathMatch(.*)*', name: 'notfound', component: NotFoundView },
]

export default createRouter({ history: createWebHashHistory(), routes })