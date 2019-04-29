import { Black } from "black-engine";
import { objectsInLayer } from './engine'

import level1_1 from 'assets/levels/level1_1.json'
import level1_2 from 'assets/levels/level1_2.json'
import level1_3 from 'assets/levels/level1_3.json'
import level1_4 from 'assets/levels/level1_4.json'
import level1_5 from 'assets/levels/level1_5.json'
import level1_6 from 'assets/levels/level1_6.json'
import level1_7 from 'assets/levels/level1_7.json'
import level1_8 from 'assets/levels/level1_8.json'
import level1_9 from 'assets/levels/level1_9.json'
import level1_10 from 'assets/levels/level1_10.json'
import level1_11 from 'assets/levels/level1_11.json'
import level1_12 from 'assets/levels/level1_12.json'
import level2_1 from 'assets/levels/level2_1.json'
import level2_2 from 'assets/levels/level2_2.json'
import level2_3 from 'assets/levels/level2_3.json'
import level2_4 from 'assets/levels/level2_4.json'
import level2_5 from 'assets/levels/level2_5.json'

const LEVELS = [
    
    ['level1_1', level1_1],
    ['level1_2',level1_2],
    ['level1_3',level1_3],
    ['level1_4',level1_4],
    ['level1_5',level1_5],
    ['level1_6',level1_6],
    ['level1_7',level1_7],
    ['level1_8',level1_8],
    ['level1_9',level1_9],
    ['level1_10',level1_10],
    ['level1_11', level1_11],
    ['level1_12', level1_12],
    ['level2_1', level2_1],
    ['level2_2', level2_2],
    ['level2_3', level2_3],
    ['level2_4', level2_4],
    ['level2_5', level2_5]

]

export default class LevelManager {
    constructor() {
        this.levels = LEVELS.map(arr => ({
            name: arr[0],
            file: arr[1],
            obj: null
        }))
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
            for(const [x, y, obj] of objectsInLayer(level.obj.world)) {
                obj.id = 'world_' + x + '_' + y
            }
        }
    }

    get level() {
        return this.levels[this.current].obj
    }

    next() {
        this.current++
        if(this.current >= this.levels.length) {
            this.current = 0
            return true
        }

        return false
    }
}