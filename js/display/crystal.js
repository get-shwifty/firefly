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
    this.children = []
    for (let i = 0; i < this.value; i++){
      const crystalType = i < this.filled ? 'allume' : 'eteint'
      this.children.push(this.addChild(new Sprite('cristal_' + (i+1) + '_' + crystalType)))
    }
  }
}