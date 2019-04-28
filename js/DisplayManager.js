import { GameObject } from "black-engine";

import Firefly from './firefly'
import Bat from './bat'

export default class DisplayManager extends GameObject {
    constructor() {
        super()
    }

    onAdded() {
        const firefly = this.addChild(new Firefly())
        const bat = this.addChild(new Bat())

        let pos = {
            x: 100,
            y: 200
        }

        firefly.updatePosition(pos)
        firefly.updateAttributes(3,3)


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