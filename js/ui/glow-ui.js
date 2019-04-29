import { GameObject, Sprite, Black, TextField} from 'black-engine'
import {TILE_SIZE, FONT} from '../game'

const MAX_HEALTH = 5

export default class GlowUI extends GameObject {
  constructor(glow) {
    super();
    this.glow = glow;
  }
  
  onAdded(m) {
    const logo = this.addChild(new Sprite('glow'))
    logo.x = 410
    logo.y = TILE_SIZE / 2
    logo.alignPivot()
    logo.scale = 0.7

    this.textField = new TextField(this.glow.toString(),FONT,0xfffad2,TILE_SIZE * 0.5)
    this.textField.x = 300
    this.textField.y = TILE_SIZE / 2
    this.textField.alignPivot()
    this.addChild(this.textField)
  }
  update(glow){
    this.textField.text = glow.toString()
  }
}