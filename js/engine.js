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
    SPIKE: 'SPIKE',
    CRYSTAL: 'CRYSTAL',
    DOOR: 'DOOR',
    SUNFLOWER: 'SUNFLOWER',
    BAT: 'BAT'
}



const DIRECTION = {
    IDLE: Victor.fromObject({ x: 0, y: 0 }),
    UP: Victor.fromObject({ x: 0, y: -1 }),
    DOWN: Victor.fromObject({ x: 0, y: 1 }),
    LEFT: Victor.fromObject({ x: -1, y: 0 }),
    RIGHT: Victor.fromObject({ x: 1, y: 0 })
}

const CAN_SWAP = {
    [Tile.GROUND]: true,
    [Tile.SPIKE]: false,
    [Tile.CRYSTAL]: true,
    [Tile.DOOR]: true,
    [Tile.SUNFLOWER]: false,
    [Tile.BAT]: false
}

const HANDLE_MOVE = {
    [Tile.GROUND]: moveToSimple,
    [Tile.SPIKE]: moveToSpike,
    [Tile.CRYSTAL]: moveToCrystal,
    [Tile.DOOR]: moveToDoor
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

///////////////////////////////////////////////////////////////////////////
// SWAP

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

    return move(state, 'IDLE')
}

///////////////////////////////////////////////////////////////////////////
// MOVE

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

///////////////////////////////////////////////////////////////////////////
// Spike

function moveToSpike(state, pos, object) {
    const res = moveToSimple(state, pos, object)
    const player = res.player

    player.life -= object.value

    return res
}

///////////////////////////////////////////////////////////////////////////
// Crystal / doors

function moveToCrystal(state, pos, crystal) {
    const res = moveToSimple(state, pos, crystal)
    const player = res.player

    const glowAdded = Math.min(player.glow, crystal.maxGlow - crystal.currentGlow)
    player.glow -= glowAdded
    crystal.currentGlow += glowAdded

    res.world = {
        [pos.x]: {
            [pos.y]: crystal
        }
    }

    if(crystal.currentGlow === crystal.maxGlow) {
        const door = _.get(state.world, [crystal.doorPos.x, crystal.doorPos.y])
        _.merge(res, openDoor(state, crystal.doorPos, door))
    }

    return res
}

function moveToDoor(state, pos, door) {
    if(!door.opened) {
        return null
    }

    return moveToSimple(state, pos, crystal)
}

function openDoor(state, pos, door) {
    if(door.opened) {
        return
    }

    const crystals = door.crystalsPos.map(pos => {
        return _.get(state.world, [pos.x, pos.y])
    })

    const open = _.every(crystals, crystal => crystal.currentGlow === crystal.maxGlow)

    if(open) {
        door.opened = true
    }

    return {
        world: {
            [pos.x]: {
                [pos.y]: door
            }
        }
    }
}

export {
    Action,
    Tile
}