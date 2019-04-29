import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from '../game'
const MAX = 5
const POS = [
        { x: 0.5, y: 0.5},
        { x: 0.20, y: 0.25},
        { x: 0.80, y: 0.25},
        { x: 0.80, y: 0.75},
        { x: 0.20, y: 0.75},
    ]

export default class Bat extends GameObject {
  constructor(bat) {
    super();
    this.value = bat.value
    this.nbAwake = bat.nbAwake;
  }
  
  onAdded(m) {    
    this.flyingBat = []
    this.sleepingBat = []
    for (let i = 0; i < this.value; i++){
      this.flyingBat.push(this.createAnimation(TILE_SIZE * POS[i].x, TILE_SIZE * POS[i].y))
      // this.sleepingBat.push(this.addChild(new Sprite('bat_hidden')))
    }
    this.updateVisibility()
  }

  update(bat){
    // this.value = bat.value // Cant change
    this.nbAwake = bat.nbAwake
    this.updateVisibility()
  }

  updateVisibility() {
    for (let i = 0; i < this.value; i++){
      this.flyingBat[i].visible = i < this.nbAwake
    }
  }

  createAnimation(x, y) {
    var sprite = new Sprite();

    sprite.blendMode = BlendMode.ADD;
    console.log(x,y)
    sprite.x = x;
    sprite.y = y;

    // Get animation Texture's
    // Take a look at * at the end - its wildcard! Correct numerical sorting will be applied automatically.
    let textureAnim = Black.assets.getTextures('bat_*');

    // Add component animation controller and play animation
    this.anim = sprite.addComponent(new AnimationController());
    this.anim.add('anim', textureAnim, 50);
    this.anim.play('anim');

    sprite.alignPivot();
    sprite.scale = 0.4

    this.addChild(sprite);

    return sprite;
  }
}