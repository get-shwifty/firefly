import { GameObject } from "black-engine";

import Firefly from './firefly'
import Bat from './bat'
import Sunflower from './sunflower'

export default class DisplayManager extends GameObject {
    constructor() {
        super()
    }

    onAdded() {
        //const firefly = this.addChild(new Firefly())
        //const bat = this.addChild(new Bat())
        //const sunFlower = this.addChild(new Sunflower())
    }

    createLevel(level) {
        console.log(level)
        // this.firefly = this.addChild(new Firefly())

        this.worldGameObjects = {
            
        }
    }

    updateLevel(diff) {
        console.log(diff)
    }
}