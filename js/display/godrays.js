import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'

export default class Godrays extends GameObject {
  constructor() {
    super();
  }

  onAdded(m) {
	  this.sprite = this.addChild(new Sprite('puit_lumiere'));
  }

  update(){
  	this.sprite.textureName = 'puit_lumiere_eteint'
  }
}
