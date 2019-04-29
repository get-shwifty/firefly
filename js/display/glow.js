import { GameObject, Black, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'

export default class Glow extends GameObject {
  constructor(glow) {
    super();
    this.value = glow;
  }
  
  onAdded(m) {
    this.g = this.addChild(new Graphics())
    const g = this.g
    const alpha = this.value * 0.1
    // console.log(this.value,alpha)
    g.clear()
    g.fillStyle(0xffffff,alpha);
    g.rect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fill();
  }
  
  update(glow){
    const g = this.g
    this.value = glow
    const alpha = this.value * 0.1
    // console.log(glow,alpha)
    g.clear()
    g.fillStyle(0xffffff,alpha);
    g.rect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fill();
  }
}