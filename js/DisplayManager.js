import { GameObject } from "black-engine";
import { Tile } from "./engine"
import Firefly from './firefly'
import Bat from './bat'
import {TILE_SIZE} from './game.js'

// To Update : when the tiles classes will be defined
const TILE_CLASS = {
    [Tile.GROUND]: GameObject,
    [Tile.BAT]: GameObject,
    [Tile.SUNFLOWER]: GameObject,
    [Tile.CRYSTAL]: GameObject,
    [Tile.DOOR]: GameObject,
    [Tile.SPIKE]: GameObject
}

export default class DisplayManager extends GameObject {
    constructor() {
        super()
    }

    onAdded() {
        const bat = this.addChild(new Bat())
    }

    cleanLevel() {
        const numChildren = this.numChildren;
        for (var i = numChildren; i > 0 ; i--){
            this.removeChildAt(i-1)
        }
    }

    createLevel(level) {
        this.cleanLevel()
        console.log(level)
        this.worldGameObjects = {}

        // Creating Player
        this.player = this.addChild(new Firefly())
        this.player.updatePosition(level.player.pos.x * TILE_SIZE, level.player.pos.y * TILE_SIZE)
        this.player.updateAttributes(level.player.life, level.player.glow)

        // Creating environment
        for(const x in Object.keys(level.world)) {
            for(const y in Object.keys(level.world[x])) {
                const CLASS = TILE_CLASS[level.world[x][y].type]
                if (CLASS){
                const newTile = this.addChild(new CLASS())
                newTile.x = Number(x) 
                newTile.y = Number(y)
                this.worldGameObjects[level.world[x][y].id] = newTile
                } else {
                    throw Error("Error : world element" + " '" + level.world[x][y].type + "' not recognized")
                }
            }
        }
        console.log(this.worldGameObjects)
    }

    updateLevel(diff) {
        console.log(diff)
    }
}