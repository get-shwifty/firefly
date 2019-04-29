import { GameObject, Sprite, Black, TextField} from 'black-engine'
import {TILE_SIZE, FONT} from '../game'

const MAX_LIFE = 5

export default class LifeUI extends GameObject {
  constructor(life) {
    super();
    this.life = life;
  }
  
  onAdded(m) {
    const logo = this.addChild(new Sprite('lifeLogo'))
    logo.x = 90
    logo.y = TILE_SIZE / 2
    logo.alignPivot()
    logo.scale = 0.9

    this.textField = new TextField(this.life.toString(),FONT,0xbb0b0b,TILE_SIZE * 0.5)
    this.textField.x = 200
    this.textField.y = TILE_SIZE / 2
    this.textField.alignPivot()
    this.addChild(this.textField)
  }
  update(life){
    this.textField.text = life.toString()
  }
}