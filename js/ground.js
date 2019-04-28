import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from './game'

export default class Ground extends GameObject {
  constructor() {
    super();
  }

  onAdded(m) {
    let sprite = new Sprite('chemin_full');

    //let texture = Black.assets.getTextures('chemin_full');
    
    this.addChild(sprite);
    /*this.anim = sprite.addComponent(new AnimationController());
    this.anim.add('anim', texture, 8);
    this.anim.play('anim');*/
  }
}