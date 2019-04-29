
import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'

export default class Exit extends GameObject {
  constructor() {
    super();
  }

  onAdded(m) {
    const sprite = new Sprite('sortie');
    this.addChild(sprite);
  }

  update(){    
  }
}