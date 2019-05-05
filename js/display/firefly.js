import { GameObject, Black, AssetManager, Sprite, VectorScatter, InitialVelocity, Acceleration, ScaleOverLife, BlendMode, AnimationController, Graphics, Tween, Ease, Emitter, FloatScatter, InitialLife } from 'black-engine'
import _ from 'lodash'
import { TILE_SIZE } from '../game'
const POS = [
  { x: 0.5, y: 0.5 },
  { x: 0.20, y: 0.20 },
  { x: 0.80, y: 0.20 },
  { x: 0.80, y: 0.80 },
  { x: 0.20, y: 0.80 },
]
const speeds = [1.5, 1, 2, 0.5, 0.3]
export default class Firefly extends GameObject {
  constructor() {
    super();
    this.MAX_LIFE = 5
    this.life = this.MAX_LIFE
    this.glow = 3
  }

  //Mouvement de la libellule
  updatePosition(x, y) {
    const duration = 0.3
    const offsetX = x - this.x;
    const offsetY = y - this.y;

    for (let i in this.fireflies) {
      const [newPosX, newPosY] = this.sinusPosition(i, Black.time.dt * 60 * duration, offsetX, offsetY)
      let tween = new Tween({ x: newPosX, y: newPosY }, duration, { ease: Ease.backOut })
      this.fireflies[i].addComponent(tween);
    }
    setTimeout(() => { this.x = x; this.y = y }, duration * 1000)
    // this.x = x;
    // this.y = y;
  }

  //Swap de la vie et de la lumière
  update(player) {
    this.life = player.life
    this.glow = player.glow
    //Affichage ou suppression des libellules en fonction de la vie 
    for (let i = 0; i < this.MAX_LIFE; i++) {
      if (player.swap) {
        const [newPosX, newPosY] = this.sinusPosition(i, Black.time.dt * 60 * 0.6)
        let tween1 = new Tween({ x: TILE_SIZE / 2, y: TILE_SIZE / 2 }, 0.3, { ease: Ease.backOut })
        let tween2 = new Tween({ x: newPosX, y: newPosY }, 0.3, { playOnAdded: false, ease: Ease.backIn })
        tween1.chain(tween2)
        this.fireflies[i].addComponent(tween1);
        this.fireflies[i].addComponent(tween2);
      }
      this.emitters[i].addModifier(new ScaleOverLife(new FloatScatter(0.05 * this.glow, 0, Ease.backIn)))
      this.fireflies[i].visible = i < this.life;
      this.emitters[i].alpha = i < this.life;
    }
  }

  sinusPosition(i, dtIncrement = 0, offsetX = 0, offsetY = 0) {
    const dt = Black.time.now + dtIncrement
    const dir = i % 2 == 0 ? 1 : -1
    const x = dir * Math.cos(dt * speeds[i] + POS[i].x) * TILE_SIZE / 3 + TILE_SIZE / 2 + offsetX
    const y = dir * Math.sin(2 * dt * speeds[i] + POS[i].y) * TILE_SIZE / 3 + TILE_SIZE / 2 + offsetY
    return [x, y]
  }

  onAdded(m) {
    this.fireflies = []
    this.emitters = []
    for (let i = 0; i < this.MAX_LIFE; i++) {
      this.fireflies.push(this.createAnimation(TILE_SIZE * POS[i].x, TILE_SIZE * POS[i].y))
      let e = this.createEmitter(i)
      this.emitters.push(e)
      this.fireflies[i].addChild(e)
    }
  }

  onUpdate() {
    if (this.fireflies.length == this.MAX_LIFE && this.emitters.length == this.MAX_LIFE) {
      this.updateFireflies()
    }
    else return
  }

  updateFireflies() {
    this.fireflies.forEach((_, i) => {
      const [newPosX, newPosY] = this.sinusPosition(i)
      this.fireflies[i].x = newPosX
      this.fireflies[i].y = newPosY
    })
  }

  createEmitter(i) {
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

      // Give some acceleration in all directions
      new Acceleration(new VectorScatter(-20, -20, 20, 20)),
    );

    // Add to scene
    emitter.x = TILE_SIZE / 2
    emitter.y = TILE_SIZE / 2
    return emitter
  }

  createAnimation(x, y) {
    var sprite = new Sprite();

    sprite.x = x;
    sprite.y = y;

    // Get animation Texture's
    // Take a look at * at the end - its wildcard! Correct numerical sorting will be applied automatically.
    let textureAnim = Black.assets.getTextures('luciole_face*');

    // Add component animation controller and play animation
    this.anim = sprite.addComponent(new AnimationController());
    this.anim.add('anim', textureAnim, 50);
    this.anim.play('anim');

    sprite.scale = 0.3

    sprite.alignPivotOffset()
    this.addChild(sprite);

    return sprite;
  }
}
