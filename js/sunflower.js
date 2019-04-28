import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

const TILE_SIZE = 200

export default class Sunflower extends GameObject {
  constructor() {
    super();
    this.numberFlowers = 3;
    this.glow_received = 1;
  }

  onAdded(m) {
    this.g = this.addChild(new Graphics())
    const g = this.g

    g.clear()
    g.lineStyle(1, 0xf9b626);
    g.rect(this.x, this.y, TILE_SIZE, TILE_SIZE);
    g.stroke();

    this.createAnimation(0,0)
    
  }

  createAnimation(x, y) {
    var sprite = new Sprite();

    sprite.blendMode = BlendMode.ADD;
    sprite.x = x;
    sprite.y = y;

    // Get animation Texture's
    //On crée un deuxième tableau qui prend l'ordre inverse des images
    let textureAnim = Black.assets.getTextures('fleur_*');
    let reverseAnim = textureAnim.slice().reverse()

    this.anim = sprite.addComponent(new AnimationController());

    this.anim.add('anim', textureAnim, 8);
    this.anim.add('animReverse', reverseAnim, 8);

    sprite.alignPivot();
    sprite.scale = 1.0

    this.addChild(sprite);
  }

  //Mouvement de la fleur en fonction de la luminosité
  flowerMouvment(glow_received){
  	if(glow_received >= this.numberFlowers){
  		this.anim.play('anim');
  	}else{
  		this.anim.play('animReverse');
  	}

  	this.anim.currentAnimation.loop = false;
  	
  }

}