import _ from 'lodash'
import { Black, GameObject, AssetManager, Key } from 'black-engine';

import LevelManager from './LevelManager'
import DisplayManager from './DisplayManager'
import SoundManager from './SoundManager'
import Ui from './ui'
import gameLoop, { Action, initState, objectsInLayer, Tile } from './engine'

import spriteFirefly from 'assets/sprite/lucioles.png'
import spriteBat from 'assets/sprite/bats.png'
import particleFirefly from 'assets/sprite/particle_firefly.png'
import spriteOthers from 'assets/sprite/assets_atlas.png'
import jsonFirefly from 'assets/sprite/luciole_atlas.json'
import jsonBat from 'assets/sprite/bat_atlas.json'
import jsonOther from 'assets/sprite/assets_atlas.json'
import bloc from 'assets/sprite/bloc.png'
import batHidden from "assets/sprite/bat_hidden.png"
import lifeLogo from "assets/sprite/life.png"
import glogo from "assets/sprite/light.png"
import glow from "assets/sprite/dalles.png"
import ground from "assets/sprite/ground.png"

export const FONT = 'Indie Flower'

export const TILE_SIZE = 200
import { NB_TILES_WIDTH, NB_TILES_HEIGHT } from './main'

const CAM_MARGIN = 2

export const GameEvent = {
    LEVEL_FINISHED: 'LEVEL_FINISHED',
    DEAD: 'DEAD',
    SWAPPED: 'SWAPPED',
    HIT_BY_SPIKE: 'HIT_BY_SPIKE',
    HIT_BY_BAT: 'HIT_BY_BAT',
    CRYSTAL_FILLED: 'CRYSTAL_FILLED',
    DOOR_OPENED: 'DOOR_OPENED',
    FORBIDDEN: 'FORBIDDEN',
    GODRAYS_CONSUMED: 'GODRAYS_CONSUMED',
    RESTART: 'RESTART'
}

export class Game extends GameObject {
    constructor() {
        super()

        const assets = new AssetManager()

        this.levelManager = new LevelManager()
        this.levelManager.enqueueLevels(assets)

        this.soundManager = new SoundManager()
        this.soundManager.enqueueSounds(assets)

        assets.enqueueGoogleFont(FONT)

        assets.enqueueAtlas('firefly', spriteFirefly, jsonFirefly);
        assets.enqueueAtlas('bat', spriteBat, jsonBat);
        assets.enqueueAtlas('other', spriteOthers, jsonOther);
        assets.enqueueImage('particle_firefly', particleFirefly)

        assets.enqueueImage('batHidden', batHidden);
        assets.enqueueImage('lifeLogo', lifeLogo);
        assets.enqueueImage('glogo', glogo);
        assets.enqueueImage('glow', glow);
        assets.enqueueImage('bloc', bloc);
        assets.enqueueImage('ground', ground);

        assets.on('complete', this.onAssetsLoadded, this)
        assets.loadQueue()
    }

    onAssetsLoadded(m) {
        this.displayManager = this.addChild(new DisplayManager())
        this.ui = this.addChild(new Ui())

        this.levelManager.onAssetsLoadded()
        this.soundManager.onAssetsLoadded()
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
            case Key.BACKSPACE:
                this.trigger(GameEvent.RESTART)
                this.onNewLevel()
            break
        }

        if(action) {
            const { state, changes } = gameLoop(this.state, action)
            if(!_.isEmpty(changes.after)) {
                this.displayManager.updateLevel(changes.after)
                this.state = state
                this.changes = changes
                this.onStateChanged()
            } else {
                this.trigger(GameEvent.FORBIDDEN)
            }
        }
    }

    onNewLevel() {
        this.state = initState(_.cloneDeep(this.levelManager.level))
        this.displayManager.createLevel(this.state)
        this.soundManager.createLevel(this.state)
        this.ui.onStateChanged(this.state)
        this.initCamera()
    }

    onStateChanged() {
        this.updateCamera()
        this.soundManager.updateLevel(this.state)
        this.ui.onStateChanged(this.state)

        const player = this.state.player
        
        // Manage death
        if(player.life <= 0) {
            // TODO animate ?
            this.trigger(GameEvent.DEAD)
            return this.onNewLevel()
        }

        if(this.state.win) {
            this.trigger(GameEvent.LEVEL_FINISHED)
            const finished = this.levelManager.next()
            if(finished) {
                // TODO
                console.log('END OF THE GAME TODO')
                return this.onNewLevel() // tmp
            } else {
                return this.onNewLevel()
            }
        }

        // Trigger game events
        const after = this.changes.after
        if(after.player && after.player.swap) {
            this.trigger(GameEvent.SWAPPED)
        }
        for(const [x, y, obj] of objectsInLayer(after.world)) {
            switch(obj.type) {
                case Tile.SPIKE:
                    if(obj.playerLifeTaken) {
                        this.trigger(GameEvent.HIT_BY_SPIKE)
                    }
                break
                case Tile.BAT:
                    if(obj.playerLifeTaken) {
                        this.trigger(GameEvent.HIT_BY_BAT)
                    }
                break
                case Tile.CRYSTAL:
                    this.trigger(GameEvent.CRYSTAL_FILLED)
                break
                case Tile.DOOR:
                    this.trigger(GameEvent.DOOR_OPENED)
                break
                case Tile.GODRAYS:
                    this.trigger(GameEvent.GODRAYS_CONSUMED)
                break
            }
        }
    }

    trigger(name) {
        this.soundManager.trigger(name)
    }

    initCamera() {
        this.cam = { x: 0, y: 0 }

        this.levelMinX = Infinity
        this.levelMinY = Infinity
        this.levelMaxX = -Infinity
        this.levelMaxY = -Infinity
        for(const [x, y, obj] of objectsInLayer(this.state.world)) {
            this.levelMinX = Math.min(this.levelMinX, x)
            this.levelMaxX = Math.max(this.levelMaxX, x)
            this.levelMinY = Math.min(this.levelMinY, y)
            this.levelMaxY = Math.max(this.levelMaxY, y)
        }

        
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
        this.updateCamera()
    }

    updateCamera() {
        const player = this.state.player.pos
        
        const deltaPlayer = {
            x: player.x - this.cam.x,
            y: player.y - this.cam.y
        }

        if(deltaPlayer.x < CAM_MARGIN && this.cam.x > this.levelMinX) {
            this.cam.x--
        }
        if(deltaPlayer.y < CAM_MARGIN && this.cam.y > this.levelMinY) {
            this.cam.y--
        }
        if(deltaPlayer.x >= NB_TILES_WIDTH - CAM_MARGIN
            && this.cam.x <= this.levelMaxX - NB_TILES_WIDTH) {
            this.cam.x++
        }
        if(deltaPlayer.y >= NB_TILES_HEIGHT - CAM_MARGIN
            && this.cam.y <= this.levelMaxY - NB_TILES_HEIGHT) {
            this.cam.y++
        }

        this.displayManager.x = -this.cam.x * TILE_SIZE
        this.displayManager.y = -(this.cam.y-1) * TILE_SIZE

        this.displayManager.onCameraMoved(
            this.state, -this.cam.x, -this.cam.y, NB_TILES_WIDTH, NB_TILES_HEIGHT)
    }
}
