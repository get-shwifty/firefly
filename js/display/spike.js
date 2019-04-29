import { GameObject, Black, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'
const MAX = 5
const POS = [
        { x: 0.5, y: 0.5},
        { x: 0.20, y: 0.20},
        { x: 0.80, y: 0.20},
        { x: 0.80, y: 0.80},
        { x: 0.20, y: 0.80},
    ]

export default class Spike extends GameObject {
  constructor(spike) {
    super();
    this.value = spike.value;
  }
  
  onAdded(m) {
    this.addChild(new Sprite('pic_' + this.value))
  }
  update(){
  }
}