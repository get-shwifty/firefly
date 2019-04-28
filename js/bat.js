import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from './game'
const POS = [
        { x: 0.5, y: 0.5},
        { x: 0.20, y: 0.20},
        { x: 0.80, y: 0.20},
        { x: 0.80, y: 0.80},
        { x: 0.20, y: 0.80},
    ]

export default class Bat extends GameObject {
  constructor() {
    super();
    this.number = 5;
  }

  //Affichage ou suppression des chauves-souris en fonction de la lumière reçue 
  updateNumberOfBats(glow_received) {
    this.number = 5 - glow_received
    console.log(this.number)

    for (let i = 0; i < 5; i++){
        this.children[i].visible = i < this.number;
    }
  }

  update(bat){
      this.number = bat.value
    for (let i = 0; i < 5; i++){
        this.children[i].visible = i < this.number;
    }
  }

  onAdded(m) {
    this.g = this.addChild(new Graphics())
    const g = this.g

    g.clear()
    g.lineStyle(1, 0xf9b626);
    g.rect(this.x, this.y, TILE_SIZE, TILE_SIZE);
    g.stroke();

    this.children = []
    for (let i = 0; i < 5; i++){
        this.children.push(this.createAnimation(TILE_SIZE*POS[i].x, TILE_SIZE*POS[i].y))
    }
  }

  createAnimation(x, y) {
    var sprite = new Sprite();

    sprite.blendMode = BlendMode.ADD;
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
    sprite.scale = 0.3

    this.addChild(sprite);

    return sprite;
  }
}