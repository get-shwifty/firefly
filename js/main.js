import { CanvasDriver, Input, Engine, StageScaleMode, MasterAudio } from "black-engine";
import { Game, TILE_SIZE } from "./game";

export const NB_TILES_WIDTH = 12
export const NB_TILES_HEIGHT = 7

// Game will be our starting class and rendering will be done on Canvas
const black = new Engine('container', Game, CanvasDriver, [Input, MasterAudio]);

// Pause simulation when container loses focus
black.pauseOnBlur = false;

// Pause simulation when page is getting hidden
black.pauseOnHide = false;

// Wroom, wroom!
black.start();

// // Set default stage size
black.stage.setSize(TILE_SIZE*NB_TILES_WIDTH, TILE_SIZE*(NB_TILES_HEIGHT+1));

// // Makes stage always centered
black.stage.scaleMode = StageScaleMode.LETTERBOX;

