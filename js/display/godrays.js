import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'

export default class Godrays extends GameObject {
  constructor() {
    super();
  }

  onAdded(m) {
    this.g = this.addChild(new Graphics())
    const g = this.g
    g.clear()
    g.lineStyle(1, 0xf9b626);
    g.rect(this.x, this.y, TILE_SIZE, TILE_SIZE);
    g.stroke();

	  this.sprite = this.addChild(new Sprite('puit_lumiere'));
  }

  update(){
  	this.sprite.textureName = 'puit_lumiere_eteint'
  }
}
