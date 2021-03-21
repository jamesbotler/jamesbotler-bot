import { EventEmitter } from 'events'

const Event = {
    GAME_INIT: 'gameInit',
    GAME_READY: 'gameReady',
    CYCLE_DAY: 'cycleDay',
    CYCLE_NIGHT: 'cycleNight',
    GAME_OVER: 'gameOver',
    PLAYER_JOIN: 'playerJoin',
    PLAYER_LEAVE: 'playerLeave',
    
}

export class Game extends EventEmitter {
    constructor() {

    }

    
}