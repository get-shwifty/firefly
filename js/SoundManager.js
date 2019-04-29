import { Black } from "black-engine";
import { objectsInLayer } from './engine'


import bat from 'assets/audio/music/ld44_bat.ogg'
import crystal from 'assets/audio/music/ld44_crystals.ogg'
import door from 'assets/audio/music/ld44_door.ogg'
import exit from 'assets/audio/music/ld44_exit.ogg'
import firefly from 'assets/audio/music/ld44_firefly.ogg'
import flower from 'assets/audio/music/ld44_flowers.ogg'
import frog from 'assets/audio/music/ld44_frog.ogg'
import godray from 'assets/audio/music/ld44_lightshaft.ogg'

export default class SoundManager {
    constructor() {
        
    }

    enqueueSounds(assets) {
        assets.enqueueSound('batSound', bat)
        assets.enqueueSound('crystalSound', crystal)
        assets.enqueueSound('doorSound', door)
        assets.enqueueSound('exitSound', exit)
        assets.enqueueSound('fireflySound', firefly)
        assets.enqueueSound('flowerSound', flower)
        assets.enqueueSound('frogSound', frog)
        assets.enqueueSound('godraySound', godray)
    }

    onAssetsLoadded() {

        Black.audio.createChannel('batChannel')
        this.bat = Black.audio.play('batSound', 'batChannel', 0, true)

        Black.audio.createChannel('crystalChannel')
        this.crystal = Black.audio.play('crystalSound', 'crystalChannel', 0, true)

        Black.audio.createChannel('doorChannel')
        this.door = Black.audio.play('doorSound', 'doorChannel', 0, true)

        Black.audio.createChannel('exitChannel')
        this.exit = Black.audio.play('exitSound', 'exitChannel', 0, true)

        Black.audio.createChannel('fireflyChannel')
        this.firefly = Black.audio.play('fireflySound', 'fireflyChannel', 0, true)

        Black.audio.createChannel('flowerChannel')
        this.flower = Black.audio.play('flowerSound', 'flowerChannel', 0, true)

        Black.audio.createChannel('frogChannel')
        this.frog = Black.audio.play('frogSound', 'frogChannel', 0, true)

        Black.audio.createChannel('godrayChannel')
        this.godray = Black.audio.play('godraySound', 'godrayChannel', 0, true)

    }

    updateLevel(state){

        console.log(state)

        this.getdistancefromplayer(state)
    }

    createLevel(state){
        console.log("level created")
        //updateLevel(state)
    }
    
    getdistance(x,y,playerpos)
    {
        let dx = Math.abs(x - playerpos.x)
        let dy = Math.abs(y- playerpos.y)

        return dx+dy
    }

    getdistancefromplayer(state)
    {
        console.log(state.player)
        let playerpos = state.player.pos;

        let distancemap = {};

        for(const [x, y, obj] of objectsInLayer(state.world)) {

            let curdistance = this.getdistance(x,y,playerpos)
           
            if(distancemap[obj.type])
            {
                if(curdistance < distancemap[obj.type])
                {
                    distancemap[obj.type] = curdistance;
                }
            }
            else
            {
                distancemap[obj.type] = curdistance;
            }
        }

        console.log(distancemap)
    }


}