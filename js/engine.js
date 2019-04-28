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
<<<<<<< HEAD
    SPIKE: 'SPIKE',
    CRYSTAL: 'CRYSTAL',
    DOOR: 'DOOR',
    SUNFLOWER: 'SUNFLOWER',
    BAT: 'BAT'
=======
    SPIKE: 'SPIKE'
>>>>>>> f665ef8747898c64a14d3bd26b281dc0a9e78d22
}



const DIRECTION = {
    UP: Victor.fromObject({ x: 0, y: -1 }),
    DOWN: Victor.fromObject({ x: 0, y: 1 }),
    LEFT: Victor.fromObject({ x: -1, y: 0 }),
    RIGHT: Victor.fromObject({ x: 1, y: 0 })
}

const CAN_SWAP = {
    [Tile.GROUND]: true,
    [Tile.SPIKE]: false,
}

const HANDLE_MOVE = {
    [Tile.GROUND]: moveToSimple,
    [Tile.SPIKE]: moveToSpike
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
    const object = _.get(state.world, [pos.x, pos.y])

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

    // const fromObject = _.get(state.world, [fromPos.x, fromPos.y])
    const toObject = _.get(state.world, [toPos.x, toPos.y])

    if(!toObject) {
        return null
    }

    if(!HANDLE_MOVE[toObject.type]) {
        return null
    }

    return HANDLE_MOVE[toObject.type](state, toPos.toObject(), toObject)
}

function moveToSimple(state, pos, object) {
    const player = state.player
    player.pos = pos

    return {
        player
    }
}

function moveToSpike(state, pos, object) {
    const res = moveToSimple(state, pos, object)
    const player = res.player

    player.life -= object.value

    return res
}

export {
    Action,
    Tile
}