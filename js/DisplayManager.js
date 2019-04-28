import { GameObject } from "black-engine";
import { Tile } from "./engine"
import Firefly from './firefly'
import Bat from './bat'
import Sunflower from './sunflower'
import Ground from './ground'
import Door from './door'
import {TILE_SIZE} from './game.js'


// To Update : when the tiles classes will be defined
const TILE_CLASS = {
    [Tile.GROUND]: GameObject,
    [Tile.BAT]: Bat,
    [Tile.SUNFLOWER]: Sunflower,
    [Tile.CRYSTAL]: GameObject,
    [Tile.DOOR]: GameObject,
    [Tile.SPIKE]: GameObject
}

export default class DisplayManager extends GameObject {
    constructor() {
        super()
    }

    onAdded() {
    }

    cleanLevel() {
        while (this.numChildren > 0){
            this.removeChildAt(this.numChildren-1)
        }    
    }

    createLevel(level) {
        this.cleanLevel()
        console.log(level)
        this.worldGameObjects = {}

        // Creating Player
        this.player = this.addChild(new Firefly())
        this.player.updatePosition(level.player.pos.x * TILE_SIZE, level.player.pos.y * TILE_SIZE)
        this.player.update(level.player)

        // Creating environment
        for(const x of Object.keys(level.world)) {
            for(const y of Object.keys(level.world[x])) {
                const CLASS = TILE_CLASS[level.world[x][y].type]
                if (CLASS){
                const newTile = this.addChild(new CLASS())
                newTile.x = +x 
                newTile.y = Number(y)
                this.worldGameObjects[level.world[x][y].id] = newTile
                } else {
                    throw Error("Error : world element" + " '" + level.world[x][y].type + "' not recognized")
                }
            }
        }
        // console.log(this.worldGameObjects)
    }

    updateLevel(diff) {
        console.log(diff)
        if (diff.player){
            this.player.updatePosition(diff.player.pos.x * TILE_SIZE, diff.player.pos.y * TILE_SIZE)
            this.player.update(diff.player)
        }
        if (diff.world){
            for(const x of Object.keys(diff.world)) {
                for(const y of Object.keys(diff.world[x])) {
                    console.log(x,y,diff.world[x][y],this.worldGameObjects[diff.world[x][y].id])
                    this.worldGameObjects[diff.world[x][y].id].update(diff.world[x][y])
                }
            }
        }
    }
}