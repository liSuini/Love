import heartbeat from './heartbeat/config'
import wheel from './wheel/config'
import quiz from './quiz/config'

export const modes = [heartbeat, wheel, quiz]
export const getMode = (id) => modes.find(m => m.id === id)
