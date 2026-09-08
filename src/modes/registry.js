import heartbeat from './heartbeat/config'
import wheel from './wheel/config'
import quiz from './quiz/config'
import board from './board/config'

export const modes = [heartbeat, wheel, quiz, board]
export const getMode = (id) => modes.find(m => m.id === id)
