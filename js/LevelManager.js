import { Black } from "black-engine";

import level1_1 from 'assets/levels/level1_8.json'

export default class LevelManager {
    constructor() {
        this.levels = [{
            name: 'level1_1',
            file: level1_1,
            obj: null
        }]
        this.current = 0
    }

    enqueueLevels(assets) {
        for(const level of this.levels) {
            assets.enqueueJSON(level.name, level.file)
        }
    }

    onAssetsLoadded() {
        // Check levels
        for(const level of this.levels) {
            level.obj = Black.assets.getJSON(level.name)
            for(const x of Object.keys(level.obj.world)) {
                for(const y of Object.keys(level.obj.world[x])) {
                    const obj = level.obj.world[x][y]
                    obj.id = 'world_' + x + '_' + y
                }
            }
        }
    }

    get level() {
        return this.levels[this.current].obj
    }

    next() {
        this.current++
        if(this.current >= this.levels.lenght) {
            this.current = 0
            return true
        }

        return false
    }
}