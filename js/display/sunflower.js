import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'
const MAX = 5
const POS = [
    { x: 0.5, y: 0.5},
    { x: 0.25, y: 0.20},
    { x: 0.75, y: 0.20},
    { x: 0.75, y: 0.80},
    { x: 0.25, y: 0.80},
]
export default class Sunflower extends GameObject {
  constructor(flower) {
    super();
    this.value = flower.value;
    this.nbUp = flower.nbUp;
  }

  onAdded(m) {
    this.flower = []
    for (let i = 0; i < this.value; i++){
      this.flower.push(
        this.createAnimation(i < this.nbUp ? 'fleur_4' : 'fleur_1',TILE_SIZE * POS[i].x, TILE_SIZE * POS[i].y)
        )
    }
  }
  
  update(flower){
    // Animate up only if was down
    if(flower.nbUp > this.nbUp && flower.nbUp === this.value) {
      for (let i = 0; i < this.value; i++) {
        this.flowerAnimateUp(this.flower[i].getComponent(AnimationController))
      }
    }
    // Animate down only if was up
    if(flower.nbUp < this.nbUp && this.nbUp === this.value) {
      for (let i = 0; i < this.value; i++) {
        this.flowerAnimateDown(this.flower[i].getComponent(AnimationController))
      }
    }
    this.value = flower.value
    this.nbUp = flower.nbUp
  }
  
  
  createAnimation(spriteName,x,y) {
    const sprite = new Sprite(spriteName)
    sprite.x = x;
    sprite.y = y;

    // Get animation Texture's
    //On crée un deuxième tableau qui prend l'ordre inverse des images
    let textureAnim = Black.assets.getTextures('fleur_*');
    let reverseAnim = textureAnim.slice().reverse()

    this.anim = sprite.addComponent(new AnimationController());
    this.anim.add('anim', textureAnim, 8);
    this.anim.add('animReverse', reverseAnim, 8);
    
    sprite.alignPivot()
    sprite.scale = 0.6
    return this.addChild(sprite)
  }
  
  flowerAnimateUp(anim){
    anim.play('anim');
    anim.currentAnimation.loop = false;
  }
  flowerAnimateDown(anim){
    anim.play('animReverse');
    anim.currentAnimation.loop = false;
  }
}