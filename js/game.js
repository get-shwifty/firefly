import LevelManager from './core/LevelManager'
import DisplayManager from './display/DisplayManager'
import gameLoop, { actions } from './core/engine'
import { GameObject, AssetManager } from 'black-engine';

const TILE_SIZE = 100

export class Game extends GameObject {
    constructor() {
        super()

        this.levelManager = new LevelManager()
        this.displayManager = new DisplayManager()

        const assets = new AssetManager()

        this.levelManager.enqueueLevels(assets)

        assets.on('complete', this.onAssetsLoadded, this)
        assets.loadQueue()
    }

    onAssetsLoadded(m) {
        this.levelManager.onAssetsLoadded()
        this.onNewLevel()
    }

    onKeyPress(msg, keyInfo) {
        let action;
        switch (keyInfo.keyCode) {
            case Key.UP_ARROW:
            action = actions.UP
            break
            case Key.DOWN_ARROW:
            action = actions.DOWN
            break
            case Key.LEFT_ARROW:
            action = actions.LEFT
            break
            case Key.RIGHT_ARROW:
            action = actions.RIGHT
            break
            case Key.SPACE:
            action = actions.SWAP
            break
        }

        if(action) {
            const diff = gameLoop(state, action)
            this.displayManager.updateLevel(diff)
        }
    }

    onNewLevel() {
        this.displayManager.createLevel(this.levelManager.level)
    }
}

export {
    TILE_SIZE
}