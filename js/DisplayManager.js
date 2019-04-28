import { GameObject } from "black-engine";


export default class DisplayManager extends GameObject {
    constructor() {
        super()
    }

    createLevel(level) {
        console.log(level)
        // this.firefly = this.addChild(new Firefly())

        this.worldGameObjects = {
            
        }
    }

    updateLevel(diff) {
        
    }
}