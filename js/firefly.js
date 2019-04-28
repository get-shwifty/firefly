import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from './game'
const POS = [
        { x: 0.5, y: 0.5},
        { x: 0.20, y: 0.20},
        { x: 0.80, y: 0.20},
        { x: 0.80, y: 0.80},
        { x: 0.20, y: 0.80},
    ]

export default class Firefly extends GameObject {
  constructor() {
    super();
    this.life = 5
    this.glow = 3
  }

  //Mouvement de la libellule
  updatePosition(pos){
    this.x = pos.x;
    this.y = pos.y;
  }

  //Swap de la vie et de la lumière
  updateAttributes(life, glow) {
    this.life = life
    this.glow = glow 

    //Affichage ou suppression des libellules en fonction de la vie 
    for (let i = 0; i < 5; i++){
        this.children[i].visible = i < this.life;
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
    let textureAnim = Black.assets.getTextures('luciole_face*');

    // Add component animation controller and play animation
    this.anim = sprite.addComponent(new AnimationController());
    this.anim.add('anim', textureAnim, 50);
    this.anim.play('anim');

    sprite.alignPivot();
    sprite.scale = 0.3

    //Rotation des lucioles
    let tween = new Tween({ rotation: 2 * Math.PI }, 4, { ease: Ease.linear });
    // Set loop to true
    tween.loop = true;
    sprite.addComponent(tween);

    this.addChild(sprite);

    return sprite;
  }
}
