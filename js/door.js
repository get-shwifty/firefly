import { GameObject, Black, AssetManager, Sprite, BlendMode, AnimationController, Graphics, Tween, Ease } from 'black-engine'

import {TILE_SIZE} from './game'

export default class Door extends GameObject {
  constructor() {
    super();
    this.open = false;
  }

  onAdded(m) {
	this.sprite = this.addChild(new Sprite('porte_face_fermee'));
  }

  openDoor(){
  	this.sprite.textureName = 'porte_face_ouverte'
  }
}
