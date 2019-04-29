import { GameObject, Black, AssetManager, Sprite, VectorScatter, InitialVelocity, Acceleration, ScaleOverLife, BlendMode, AnimationController, Graphics, Tween, Ease, Emitter, FloatScatter, InitialLife  } from 'black-engine'

import {TILE_SIZE} from '../game'
const POS = [
        { x: 0.5, y: 0.5},
        { x: 0.20, y: 0.20},
        { x: 0.80, y: 0.20},
        { x: 0.80, y: 0.80},
        { x: 0.20, y: 0.80},
    ]
const speeds = [1.5, 1, 2, 0.5, 0.3]
export default class Firefly extends GameObject {
  constructor() {
    super();
    this.life = 5
    this.glow = 3
  }

  //Mouvement de la libellule
  updatePosition(x,y){
    this.x = x;
    this.y = y;
  }

  //Swap de la vie et de la lumière
  update(player) {
    this.life = player.life
    this.glow = player.glow 
    //Affichage ou suppression des libellules en fonction de la vie 
    for (let i = 0; i < 5; i++){
        this.fireflies[i].visible = i < this.life;
        this.emitters[i].addModifier(new ScaleOverLife(new FloatScatter(0.05 * this.glow, 0, Ease.backIn)),)
        this.emitters[i].alpha = i < this.life;
    }

  }

  onAdded(m) {
    this.fireflies = []
    this.emitters = []
    for (let i = 0; i < 5; i++){
        this.fireflies.push(this.createAnimation(TILE_SIZE*POS[i].x, TILE_SIZE*POS[i].y))
        this.emitters.push(this.createEmitter())
    }
  }

  onUpdate(){
    if(this.fireflies.length == 5 && this.emitters.length == 5)
    {
      const dt =  Black.time.now
      this.updateFireflies(dt)
    }
    else return
  }

  updateFireflies(dt){
    this.fireflies.forEach((_, i) => {
      const dir = i%2 == 0 ? 1 : -1
      const newPosX = dir * Math.cos(dt * speeds[i]) * TILE_SIZE / 3 + TILE_SIZE / 2
      const newPosY = dir * Math.sin(2*dt * speeds[i]) * TILE_SIZE / 3 + TILE_SIZE / 2
      this.fireflies[i].x = newPosX
      this.fireflies[i].y = newPosY
      this.emitters[i].x = newPosX
      this.emitters[i].y = newPosY
    })
  }

  createEmitter(){
    let texture = Black.assets.getTextures('particle_firefly');
    let emitter = new Emitter();
     // Zero all default values since we dont need any particles at the start
    emitter.emitCount = new FloatScatter(0.1);
    emitter.emitDelay = new FloatScatter(0);
    emitter.emitInterval = new FloatScatter(0);

    emitter.space = this
    // Pick a texture for emitting
    emitter.textures = texture;

    emitter.add(
      // No one lives forever
      new InitialLife(0.25),

      // Initialize every particles with a random velocity inside a box
      new InitialVelocity(new VectorScatter(-100, -100, 100, 100)),

      // Make particles small over life
      new ScaleOverLife(new FloatScatter(0.02 * this.glow, 0, Ease.backIn)),

      // Give some acceleration is all directions
      new Acceleration(new VectorScatter(-20, -20, 20, 20)),
    );
 
    // Add to scene
    this.addChild(emitter);
    return emitter
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

    // //Rotation des lucioles
    // let tween = new Tween({ rotation: 2 * Math.PI }, 4, { ease: Ease.linear });
    // // Set loop to true
    // tween.loop = true;
    // sprite.addComponent(sprite);

    this.addChild(sprite);

    return sprite;
  }
}
