import _ from 'lodash'
import { Black, GameObject, AssetManager, Key } from 'black-engine';

import LevelManager from './LevelManager'
import DisplayManager from './DisplayManager'
import gameLoop, { Action } from './engine'

import spriteFirefly from 'assets/sprite/lucioles.png'
import spriteBat from 'assets/sprite/bats.png'
import spriteOthers from 'assets/sprite/assets_atlas.png'
import jsonFirefly from 'assets/sprite/luciole_atlas.json'
import jsonBat from 'assets/sprite/bat_atlas.json'
import jsonOther from 'assets/sprite/assets_atlas.json'


const TILE_SIZE = 200

export class Game extends GameObject {
    constructor() {
        super()

        this.levelManager = new LevelManager()

        const assets = new AssetManager()

        this.levelManager.enqueueLevels(assets)

        assets.enqueueAtlas('firefly', spriteFirefly, jsonFirefly);
        assets.enqueueAtlas('bat', spriteBat, jsonBat);
        assets.enqueueAtlas('other', spriteOthers, jsonOther);

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
            action = Action.UP
            break
            case Key.DOWN_ARROW:
            action = Action.DOWN
            break
            case Key.LEFT_ARROW:
            action = Action.LEFT
            break
            case Key.RIGHT_ARROW:
            action = Action.RIGHT
            break
            case Key.SPACE:
            action = Action.SWAP
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