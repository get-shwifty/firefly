import _ from 'lodash'
import { Black, GameObject, AssetManager, Key } from 'black-engine';

import LevelManager from './LevelManager'
import DisplayManager from './DisplayManager'
import gameLoop, { actions } from './engine'

const TILE_SIZE = 200

export class Game extends GameObject {
    constructor() {
        super()

        this.levelManager = new LevelManager()

        const assets = new AssetManager()

        this.levelManager.enqueueLevels(assets)

        assets.on('complete', this.onAssetsLoadded, this)
        assets.loadQueue()
    }

    onAssetsLoadded(m) {
        this.displayManager = this.addChild(new DisplayManager())

        this.levelManager.onAssetsLoadded()
        this.onNewLevel()

        Black.input.on('keyPress', this.onKeyPress, this)
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
            const diff = gameLoop(this.state, action)
            this.displayManager.updateLevel(diff)
        }
    }

    onNewLevel() {
        this.state = _.cloneDeep(this.levelManager.level)
        this.displayManager.createLevel(this.state)
    }
}

export {
    TILE_SIZE
}