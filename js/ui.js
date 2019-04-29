import { Black, GameObject, Graphics, TextField, FontAlign } from "black-engine";
import LifeUI from "./ui/life"
import GlowUI from "./ui/glow-ui"
import { NB_TILES_WIDTH, NB_TILES_HEIGHT } from './main'
import { TILE_SIZE, FONT } from './game'

export default class Ui extends GameObject {
    constructor() {
        super()
    }

    onAdded() {
        this.panel = this.addChild(new UiPanel)
        this.panel.x = 0
        this.panel.y = 0
    }

    onStateChanged(state){
        this.panel.onStateChanged(state)
    }
}

class UiPanel extends GameObject {
    constructor() {
        super()
    }

    onAdded() {
        this.g = this.addChild(new Graphics())
        this.g.beginPath()
        this.g.fillStyle(0x222222, 1)
        this.g.rect(0, 0, NB_TILES_WIDTH*TILE_SIZE, TILE_SIZE)
        this.g.fill()

        const separator = new TextField(":",FONT,0x34505b,TILE_SIZE)
        separator.x = 240
        separator.y = TILE_SIZE / 2
        separator.alignPivot()
        this.addChild(separator)

        this.levelName = new TextField("lol",FONT,0x34505b,TILE_SIZE * 0.5)
        this.levelName.x = NB_TILES_WIDTH * TILE_SIZE - TILE_SIZE/2
        this.levelName.y = TILE_SIZE / 2
        this.levelName.align = FontAlign.RIGHT
        this.levelName.alignAnchor(1,0.5)
        this.addChild(this.levelName)

        this.life = this.addChild(new LifeUI(5))
        this.glow = this.addChild(new GlowUI(5))
    }

    onStateChanged(state){
        this.life.update(state.player.life)
        this.glow.update(state.player.glow)
        this.levelName.text = state.title
     }
}