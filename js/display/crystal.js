import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'

export default class Crystal extends GameObject {
  constructor(crystal) {
    super();
    this.value = crystal.value
    this.filled = crystal.filled
  }

  update(crystal){
      this.value = crystal.value
      this.filled = crystal.filled
    for (let i = 0; i < this.value; i++){
      const crystalType = i < this.filled ? 'allume' : 'eteint'
      this.children[i].textureName = 'cristal_' + (i+1) + '_' + crystalType
    }
  }

  onAdded(m) {
    this.g = this.addChild(new Graphics())
    const g = this.g

    g.clear()
    g.lineStyle(1, 0xf9b626);
    g.rect(this.x, this.y, TILE_SIZE, TILE_SIZE);
    g.stroke();

    this.children = []
    for (let i = 0; i < this.value; i++){
      const crystalType = i < this.filled ? 'allume' : 'eteint'
      this.children.push(this.addChild(new Sprite('cristal_' + (i+1) + '_' + crystalType)))
    }
  }
}