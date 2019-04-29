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
        console.log(level)
        this.cleanLevel()
        // Layer 1 : Textures ground
        const ground = this.addChild(new GameObject)
        
        // Layer 2 : Creating environment
        this.worldGameObjects = {}
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
        this.glowDict = {}
        this.glow = this.addChild(new GameObject)
        for(const x of Object.keys(level.glow)) {
            for(const y of Object.keys(level.glow[x])) {
                const glowTile = this.glow.addChild(new Glow(level.glow[x][y]))
                glowTile.x = +x * TILE_SIZE
                glowTile.y = +y * TILE_SIZE
                this.glowDict['glow_' + x + '_' + y] = glowTile
            }
        }
        
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
                    this.worldGameObjects[diff.world[x][y].id].update(diff.world[x][y])
                }
            }
        }
        if (diff.glow){
            for(const x of Object.keys(diff.glow)) {
                for(const y of Object.keys(diff.glow[x])) {
                    // console.log(x,y,diff.glow[x][y],this.glowDict['glow_' + x + '_' + y],diff.glow[x][y] || 0)
                    if(this.glowDict['glow_' + x + '_' + y]){
                        this.glowDict['glow_' + x + '_' + y].update(diff.glow[x][y] || 0)
                    } else{
                        const glowTile = this.glow.addChild(new Glow(diff.glow[x][y]))
                        glowTile.x = +x * TILE_SIZE
                        glowTile.y = +y * TILE_SIZE
                        this.glowDict['glow_' + x + '_' + y] = glowTile
                    }
                }
            }
        }
    }
}