import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'

export default class Sunflower extends GameObject {
  constructor(flower) {
    super();
    this.value = flower;
    this.up = flower.up;
  }

  onAdded(m) {
    if(this.up){
      var sprite = new Sprite('fleur_4');
    } else {
      var sprite = new Sprite('fleur_1');
    }
    this.createAnimation(sprite) 
  }

  update(flower){
    if(this.up && !flower.up){
      this.flowerAnimateDown()
    }else if(!this.up && flower.up){
      this.flowerAnimateUp()    
    }
    this.up = flower.up
  }

  createAnimation(sprite) {
    sprite.blendMode = BlendMode.ADD;
    sprite.x = 0;
    sprite.y = 0;

    // Get animation Texture's
    //On crée un deuxième tableau qui prend l'ordre inverse des images
    let textureAnim = Black.assets.getTextures('fleur_*');
    let reverseAnim = textureAnim.slice().reverse()

    this.anim = sprite.addComponent(new AnimationController());
    this.anim.add('anim', textureAnim, 8);
    this.anim.add('animReverse', reverseAnim, 8);
    
    // sprite.alignPivot()
    sprite.scale = 1.0
    this.addChild(sprite)
  }
  
  flowerAnimateUp(){
    this.anim.play('anim');
    this.anim.currentAnimation.loop = false;
  }
  flowerAnimateDown(){
    this.anim.play('animReverse');
    this.anim.currentAnimation.loop = false;
  }
}