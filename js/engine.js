import _ from 'lodash'
import Victor from 'victor'

export const Action = {
    IDLE: 'IDLE',
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    SWAP: 'SWAP'
}

export const Tile = {
    GROUND: 'GROUND',
    SPIKE: 'SPIKE',
    CRYSTAL: 'CRYSTAL',
    DOOR: 'DOOR',
    SUNFLOWER: 'SUNFLOWER',
    BAT: 'BAT',
    GODRAYS: 'GODRAYS',
    EXIT: 'EXIT',
    FROGGY: 'FROGGY'
}

export const MAX_LIFE = 5
export const MAX_GLOW = 5

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
    [Tile.BAT]: false,
    [Tile.GODRAYS]: true,
    [Tile.EXIT]: false
}

const HANDLE_MOVE = {
    [Tile.GROUND]: moveToSimple,
    [Tile.SPIKE]: moveToSpike,
    [Tile.CRYSTAL]: moveToCrystal,
    [Tile.DOOR]: moveToDoor,
    [Tile.SUNFLOWER]: moveToSunflower,
    [Tile.BAT]: moveToBat,
    [Tile.GODRAYS]: moveToGodrays,
    [Tile.EXIT]: moveToExit
}

///////////////////////////////////////////////////////////////////////////
// MAIN

export function initState(state) {
    applyGlow(state)
    return state
}

export default function gameLoop(previousState, action) {
    if(!Action[action]) {
        throw 'Unknown action: ' + action
    }
    const returnDiff = state => ({
        state,
        changes: stateChanges(previousState, state)
    })

    const state = _.cloneDeep(previousState)
    const diff = null

    // Swap
    if(action === Action.SWAP) {
        if(!swap(state)) {
            return returnDiff(state)
        }
        action = 'IDLE'
    }

    // Move
    if(!move(state, action)) {
        return returnDiff(state)
    }

    // Glow
    applyGlow(state)

    return returnDiff(state)
}

export function* objectsInState(state, layer) {
    if(!state[layer]) {
        return
    }
    for(const x of Object.keys(state[layer])) {
        for(const y of Object.keys(state[layer][x])) {
            yield [x, y, state[layer][x][y]]
        }
    }
}

export function* objectsInLayer(layer) {
    if(!layer) {
        return
    }
    for(const x of Object.keys(layer)) {
        for(const y of Object.keys(layer[x])) {
            yield [x, y, layer[x][y]]
        }
    }
}

function stateChanges(oldState, newState) {
    const diff = {
        before: {},
        after: {}
    }

    function diffProperty(property) {
        if(!_.isEqual(oldState[property], newState[property])) {
            diff.before[property] = oldState[property]
            diff.after[property] = newState[property]
        }
    }

    function diffLayer(layer) {
        // Check removed objects
        for(const [x, y, oldObject] of objectsInState(oldState, layer)) {
            if(!_.get(newState[layer], [x, y])) {
                _.setWith(diff.before, [layer, x, y], oldObject, Object)
                _.setWith(diff.after, [layer, x, y], null, Object)
            }
        }

        // Check updated objects
        for(const [x, y, newObject] of objectsInState(newState, layer)) {
            const oldObject = _.get(oldState[layer], [x, y], null)
            if(!_.isEqual(oldObject, newObject)) {
                _.setWith(diff.before, [layer, x, y], oldObject, Object)
                _.setWith(diff.after, [layer, x, y], newObject, Object)
            }
        }
    }

    diffProperty('win')
    diffProperty('player')
    diffLayer('world')
    diffLayer('glow')

    return diff
}

///////////////////////////////////////////////////////////////////////////
// SWAP

function swap(state) {
    const pos = Victor.fromObject(state.player.pos)
    const object = _.get(state.world, [pos.x, pos.y])

    if(!CAN_SWAP[object.type]) {
        return false
    }

    const player = state.player
    const { life, glow } = player
    player.life = glow
    player.glow = life

    return true
}

///////////////////////////////////////////////////////////////////////////
// MOVE

function move(state, dir) {
    const fromPos = Victor.fromObject(state.player.pos)
    const toPos = fromPos.clone().add(DIRECTION[dir])

    // const fromObject = _.get(state.world, [fromPos.x, fromPos.y])
    const toObject = _.get(state.world, [toPos.x, toPos.y])

    if(!toObject) {
        return false
    }

    if(!HANDLE_MOVE[toObject.type]) {
        return false
    }

    return HANDLE_MOVE[toObject.type](state, toPos.toObject(), toObject)
}

function moveToSimple(state, pos) {
    const player = state.player
    player.pos = pos
    return true
}

///////////////////////////////////////////////////////////////////////////
// SPIKE

function moveToExit(state, pos, exit) {
    moveToSimple(state, pos)
    state.win = true
}

///////////////////////////////////////////////////////////////////////////
// SPIKE

function moveToSpike(state, pos, spike) {
    moveToSimple(state, pos)
    const player = state.player
    player.life -= spike.value
    return true
}

///////////////////////////////////////////////////////////////////////////
// CRYSTAL / DOORS

function moveToCrystal(state, pos, crystal) {
    moveToSimple(state, pos)
    const player = state.player

    const glowAdded = Math.min(player.glow, crystal.value - crystal.filled)
    if(glowAdded === 0) {
        return false
    }

    player.glow -= glowAdded
    crystal.filled += glowAdded

    if(crystal.filled === crystal.value) {
        const door = _.get(state.world, [crystal.doorPos.x, crystal.doorPos.y])
        openDoor(state, crystal.doorPos, door)
    }

    return true
}

function moveToDoor(state, pos, door) {
    if(!door.opened) {
        return false
    }

    return moveToSimple(state, pos)
}

function openDoor(state, pos, door) {
    if(door.opened) {
        return false
    }

    const crystals = door.crystalsPos.map(pos => _.get(state.world, [pos.x, pos.y]))
    const open = _.every(crystals, crystal => crystal.filled === crystal.value)

    if(open) {
        door.opened = true
    }

    return open
}

///////////////////////////////////////////////////////////////////////////
// SUNFLOWER

function moveToSunflower(state, pos, sunflower) {
    if(sunflower.nbUp >= sunflower.value) {
        return false
    }

    return moveToSimple(state, pos)
}

///////////////////////////////////////////////////////////////////////////
// BAT

function moveToBat(state, pos, bat) {
    moveToSimple(state, pos)
    const player = state.player
    player.life -= bat.nbAwake
    return true
}

///////////////////////////////////////////////////////////////////////////
// GODRAYS

function moveToGodrays(state, pos, godrays) {
    moveToSimple(state, pos)
    if(!godrays.consumed) {
        const player = state.player
        if(player.glow < MAX_GLOW) {
            player.glow = MAX_GLOW
            godrays.consumed = true
        }
    }

    return true
}

///////////////////////////////////////////////////////////////////////////
// GLOW

function applyGlow(state) {    
    const player = state.player

    // Compute new glow
    state.glow = {}
    setGlowAt(state, player.pos.x, player.pos.y, player.glow + 1)
    for(const [x, y, object] of objectsInState(state, 'world')) {
        switch(object.type) {
            case Tile.CRYSTAL:
                if(!object.filled > 0) {
                    setGlowAt(state, x, y, object.filled)
                }
                break
            case Tile.GODRAYS:
                if(!object.consumed) {
                    setGlowAt(state, x, y, 6)
                }
                break
            // Init glow for bats and sunflowers
            case Tile.BAT:
            case Tile.SUNFLOWER:
                applyGlowToObject(object, 0)
                break
        }
    }

    // Apply glow in world
    for(const [x, y, glow] of objectsInState(state, 'glow')) {
        const object = _.get(state.world, [x, y])
        applyGlowToObject(object, glow)
    }
}

function applyGlowToObject(object, glow) {
    switch(object.type) {
        case Tile.BAT:
            object.nbAwake = Math.max(0, object.value - glow)
            break
        case Tile.SUNFLOWER:
            object.nbUp = Math.min(glow, object.value)
            break
    }
}

function hashPos(pos) {
    return pos.x + '_' + pos.y
}

class PosSet extends Set {
    constructor(ite=[]) {
        super(_.map(ite, hashPos))
    }

    has(pos) {
        return super.has(hashPos(pos))
    }

    add(pos) {
        return super.add(hashPos(pos))
    }

    delete(pos) {
        return super.delete(hashPos(pos))
    }
}

function setGlowAt(state, x, y, glow) {
    const start = { x, y, glow }
    
    const toVisit = [start]
    const visited = new PosSet(toVisit)
    
    while(toVisit.length > 0) {
        const cur = toVisit.pop()
        visited.add(cur)
        const oldGlow = _.get(state.glow, [cur.x, cur.y], 0)
        if(oldGlow < cur.glow) {
            _.setWith(state, ['glow', cur.x, cur.y], cur.glow, Object)
        }
        if(cur.glow >= 2) {
            _.forEach(DIRECTION, dir => {
                const x = +cur.x + dir.x
                const y = +cur.y + dir.y
                if(!_.get(state.world, [x, y])) {
                    return
                }
                if(!visited.has({ x, y })) {
                    toVisit.push({ x, y, glow: cur.glow - 1 })
                }
            })
        }
    }
}