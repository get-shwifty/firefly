import { GameObject, Sprite } from "black-engine";
import { Tile } from "./engine"
import Firefly from './display/firefly'
import Bat from './display/bat'
import Sunflower from './display/sunflower'
import Ground from './display/ground'
import Door from './display/door'
import Spike from './display/spike'
import Crystal from './display/crystal'
import Godrays from './display/godrays'
import Glow from './display/glow'
import {TILE_SIZE} from './game.js'


// To Update : when the tiles classes will be defined
const TILE_CLASS = {
    [Tile.GROUND]: Ground,
    [Tile.BAT]: Bat,
    [Tile.SUNFLOWER]: Sunflower,
    [Tile.CRYSTAL]: Crystal,
    [Tile.DOOR]: Door,
    [Tile.SPIKE]: Spike,
    [Tile.GODRAYS]: Godrays
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
        this.worldGameObjects = {}
        // Layer 1 : Textures ground
        const ground = this.addChild(new GameObject)

        // Layer 2 : Creating environment
        const environment = this.addChild(new GameObject)
        for(const x of Object.keys(level.world)) {
            for(const y of Object.keys(level.world[x])) {
                const CLASS = TILE_CLASS[level.world[x][y].type]
                if (CLASS){

                    // Adding basic ground texture to layer 1
                    const groundTile = ground.addChild(new GameObject)
                    groundTile.x = +x * TILE_SIZE
                    groundTile.y = +y * TILE_SIZE
                    groundTile.addChild(new Sprite('chemin_full'))

                    // New tile at layer 2
                    const newTile = environment.addChild(new CLASS(level.world[x][y]))
                    newTile.x = +x * TILE_SIZE
                    newTile.y = +y * TILE_SIZE
                    this.worldGameObjects[level.world[x][y].id] = newTile
                } else {
                    throw Error("Error : world element" + " '" + level.world[x][y].type + "' not recognized")
                }
            }
        }

        // Layer 3 : Light glow
        const glow = this.addChild(new GameObject)
        const glowTile = glow.addChild(new Glow(2))
        glowTile.x = 2
        glowTile.y = 0

        // Layer 4 : Player
        this.player = this.addChild(new Firefly())
        this.player.updatePosition(level.player.pos.x * TILE_SIZE, level.player.pos.y * TILE_SIZE)
        this.player.update(level.player)
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