import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'
const MAX = 4
const POS = [
    { x: 0.25, y: 0.20},
    { x: 0.75, y: 0.20},
    { x: 0.75, y: 0.80},
    { x: 0.25, y: 0.80},
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
        this.createAnimation('frog_1',TILE_SIZE * POS[i].x, TILE_SIZE * POS[i].y)
        )
    }
  }
  
  update(froggy){
    for (let i = 0; i < froggy.nbToAnimate; i++){
      this.froggyAnimate(this.froggy[i].getComponent(AnimationController))
    }
    this.value = froggy.value
  }
  
  
  createAnimation(spriteName,x,y) {
    const sprite = new Sprite(spriteName)
    sprite.blendMode = BlendMode.ADD;
    sprite.x = x;
    sprite.y = y;

    // Get animation Texture's
    //On crée un deuxième tableau qui prend l'ordre inverse des images
    let textureAnim = Black.assets.getTextures('frog_*');

    this.anim = sprite.addComponent(new AnimationController());
    this.anim.add('anim', textureAnim, 8);
    
    sprite.alignPivot()
    sprite.scale = 0.6
    return this.addChild(sprite)
  }
  
  froggyAnimate(anim){
    anim.play('anim');
    anim.currentAnimation.loop = false;
  }
}