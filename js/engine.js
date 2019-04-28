
const actions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    SWAP: 'SWAP'
}

export default function gameLoop(state, action) {
    console.log(state, action)
}

export {
    actions
}