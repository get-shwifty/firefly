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
    g.clear()
    g.fillStyle(0xffffff,alpha);
    g.rect(this.x, this.y, TILE_SIZE, TILE_SIZE);
    g.fill();
  }
  
  update(){
  }
}