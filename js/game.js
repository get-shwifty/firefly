import _ from 'lodash'
import { Black, GameObject, AssetManager, Key } from 'black-engine';

import LevelManager from './LevelManager'
import DisplayManager from './DisplayManager'
import SoundManager from './SoundManager'
import gameLoop, { Action, initState } from './engine'

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

        const assets = new AssetManager()

        this.levelManager = new LevelManager()
        this.levelManager.enqueueLevels(assets)

        this.soundManager = new SoundManager()
        this.soundManager.enqueueSounds(assets)

        assets.enqueueGoogleFont('Indie Flower')

        assets.enqueueAtlas('firefly', spriteFirefly, jsonFirefly);
        assets.enqueueAtlas('bat', spriteBat, jsonBat);
        assets.enqueueAtlas('other', spriteOthers, jsonOther);

        assets.on('complete', this.onAssetsLoadded, this)
        assets.loadQueue()
    }

    onAssetsLoadded(m) {
        this.displayManager = this.addChild(new DisplayManager())

        this.levelManager.onAssetsLoadded()
        //this.soundManager.onAssetsLoadded()
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
            case Key.R:
                this.onNewLevel()
                break
        }

        if(action) {
            const { state, changes } = gameLoop(this.state, action)
            if(!_.isEmpty(changes.after)) {
                console.log(state)
                this.displayManager.updateLevel(changes.after)
                this.soundManager.updateLevel(state)
                this.state = state
                this.onStateChanged()
            }
        }
    }

    onNewLevel() {
        this.state = initState(_.cloneDeep(this.levelManager.level))
        this.displayManager.createLevel(this.state)
        this.soundManager.createLevel(this.state)
    }

    onStateChanged() {
        const player = this.state.player
        
        // Manage death
        if(player.life <= 0) {
            // TODO animate ?
            this.onNewLevel()
        }

        if(this.state.win) {
            const finished = this.levelManager.next()
            if(finished) {
                // TODO
                console.log('END OF THE GAME TODO')
                this.onNewLevel() // tmp
            } else {
                this.onNewLevel()
            }
        }
    }
}

export {
    TILE_SIZE
}