import { Black, GameObject, Graphics } from "black-engine";

import { NB_TILES_WIDTH, NB_TILES_HEIGHT } from './main'
import { TILE_SIZE } from './game'

export default class Ui extends GameObject {
    constructor() {
        super()
    }

    onAdded() {
        this.g = this.addChild(new Graphics())
        this.g.beginPath()
        this.g.fillStyle(0x222222, 1)
        this.g.rect(0, 0, NB_TILES_WIDTH*TILE_SIZE, TILE_SIZE)
        this.g.fill()
    }

    onStateChanged(state){

    }
}