import { GameObject, Black, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'
const COLOR_CODE = 0xfffad2 
export default class Glow extends GameObject {
  constructor(glow) {
    super();
    this.value = glow;
  }
  
  onAdded(m) {
    this.glow = this.addChild(new Sprite('glow'))
    // this.g = this.addChild(new Graphics())
    // const g = this.g
    const alpha = this.value * 0.05
    this.glow.alpha = alpha
    // console.log(this.value,alpha)
    // g.clear()
    // g.fillStyle(COLOR_CODE,alpha);
    // g.rect(0, 0, TILE_SIZE, TILE_SIZE);
    // g.fill();
  }
  
  update(glow){
    // const g = this.g
    this.value = glow
    const alpha = this.value * 0.05
    this.glow.alpha = alpha
    // console.log(glow,alpha)
    // g.clear()
    // g.fillStyle(COLOR_CODE,alpha);
    // g.rect(0, 0, TILE_SIZE, TILE_SIZE);
    // g.fill();
  }
}  