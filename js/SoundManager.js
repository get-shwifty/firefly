import { Black } from "black-engine";

import master from 'assets/audio/music/ld44_master.ogg'
import firefly from 'assets/audio/music/ld44_firefly.ogg'

export default class SoundManager {
    constructor() {
        
    }

    enqueueSounds(assets) {
        assets.enqueueSound('masterSound', master)
        assets.enqueueSound('fireflySound', firefly)
    }

    onAssetsLoadded() {
        Black.audio.play('masterSound', 'master', 1, true)

        Black.audio.createChannel('fireflyChannel')
        //this.firefly = Black.audio.play('fireflySound', 'fireflyChannel', 1, true)
    }
}