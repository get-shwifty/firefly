import { GameObject } from "black-engine";
import { Tile } from "./engine"
import Firefly from './firefly'

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
        const firefly = this.addChild(new Firefly())

        let pos = {
            x: 100,
            y: 200
        }

        firefly.updatePosition(pos)
        firefly.updateAttributes(3,3)

    }

    createLevel(level) {
        // Clean all gameobjects (see the function in blacksmith)
        console.log(level)
        this.worldGameObjects = {}
        this.player = this.addChild(new Firefly())
        for(const x in Object.keys(level.world)) {
            for(const y in Object.keys(level.world[x])) {
                const CLASS = TILE_CLASS[level.world[x][y].type]
                if (CLASS){
                //this.worldGameObjects[level.world[x][y].id] = this.addChild(new CLASS())
                } else {
                    throw Error("Error : world element" + " '" + level.world[x][y].type + "' not recognized")
                }
            }
        }      
    }

    updateLevel(diff) {
        console.log(diff)
    }
}