import _ from 'lodash'
import Victor from 'victor'

const Action = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    SWAP: 'SWAP'
}

const Tile = {
    GROUND: 'GROUND',
    PICS: 'PICS'
}



const DIRECTION = {
    UP: Victor.fromObject({ x: 0, y: -1 }),
    DOWN: Victor.fromObject({ x: 0, y: 1 }),
    LEFT: Victor.fromObject({ x: -1, y: 0 }),
    RIGHT: Victor.fromObject({ x: 1, y: 0 })
}

const CAN_SWAP = {
    [Tile.GROUND]: true
}

export default function gameLoop(state, action) {
    state = _.cloneDeep(state)

    if(action === Action.SWAP) {
        return swap(state)
    }

    if(DIRECTION[action]) {
        return move(state, action)
    }

    throw 'Unknown action: ' + action
}


function swap(state) {
    const pos = Victor.fromObject(state.player.pos)
    const object = state.world[pos.x][pos.y]

    if(!CAN_SWAP[object.type]) {
        return null
    }

    const player = state.player
    const { life, glow } = player
    player.life = glow
    player.glow = life

    return {
        player
    }
}

function move(state, dir) {
    const fromPos = Victor.fromObject(state.player.pos)
    const toPos = fromPos.clone().add(DIRECTION[dir])


}

export {
    Action,
    Tile
}