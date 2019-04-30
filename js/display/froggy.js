import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'
const MAX = 4
const POS = [
    [
      { x: 0.4, y: 0.5}
    ],
    [
      { x: 0.20, y: 0.25},
      { x: 0.65, y: 0.70}
    ],
    [
      { x: 0.4, y: 0.25},
      { x: 0.2, y: 0.70},
      { x: 0.65, y: 0.70}
    ],
    [
      { x: 0.20, y: 0.20},
      { x: 0.65, y: 0.20},
      { x: 0.65, y: 0.70},
      { x: 0.20, y: 0.70}
    ]
]
export default class Froggy extends GameObject {
  constructor(froggy) {
    super();
    this.value = froggy.value;
  }

  onAdded(m) {
    this.froggy = []
    for (let i = 0; i < this.value; i++){
      this.froggy.push(
        this.createAnimation('frog_1',TILE_SIZE * POS[this.value-1][i].x, TILE_SIZE * POS[this.value-1][i].y)
        )
    }
  }
  
  update(froggy){
    if (froggy.playerLifeTaken){
      for (let i = 0; i < this.value; i++){
        this.froggyAnimate(this.froggy[i].getComponent(AnimationController))
      }
    }
  }
  
  
  createAnimation(spriteName,x,y) {
    const sprite = new Sprite(spriteName)
    sprite.x = x;
    sprite.y = y;

    // Get animation Texture's
    let textureAnim = Black.assets.getTextures('frog_*');
    let reverseAnim = textureAnim.slice().reverse()
    textureAnim = textureAnim.concat(reverseAnim)

    this.anim = sprite.addComponent(new AnimationController());
    this.anim.add('anim', textureAnim, 15);
    
    sprite.alignPivot()
    sprite.scale = 0.6
    return this.addChild(sprite)
  }
  
  froggyAnimate(anim){
    anim.play('anim');
    anim.currentAnimation.loop = false;
  }
}