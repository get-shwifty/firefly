import { Black } from "black-engine";

import level1_1 from 'assets/levels/level1_1.json'

export default class LevelManager {
  constructor() {
    this.levels = [{
      name: 'level1_1',
      file: level1_1
    }]
    this.current = 0
  }

  enqueueLevels(assets) {
    for(const level of this.levels) {
      assets.enqueueJSON(level.name, level.file)
    }
  }

  get level() {
    return Black.assets.getJSON(this.levels[this.current].name)
  }
}