import heartbeat from './heartbeat/config'
import wheel from './wheel/config'
import quiz from './quiz/config'
import board from './board/config'
import pose from './pose/config'
import gomoku from './gomoku/config'
import tictactoe from './tictactoe/config'
import memory from './memory/config'
import snake from './snake/config'
import whack from './whack/config'
import reaction from './reaction/config'

export const modes = [heartbeat, wheel, quiz, board, pose, gomoku, tictactoe, memory, snake, whack, reaction]
export const getMode = (id) => modes.find(m => m.id === id)
