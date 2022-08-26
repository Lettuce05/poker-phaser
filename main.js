import './style.css'
import Phaser from 'phaser';
import Game from '@/scenes/Game';

let width = 1920;
let height = 1080;


if (window.innerWidth < 1000) {
  width = 1080;
  height = 1920;
}


export default new Phaser.Game({
  type: Phaser.AUTO,
  scale: {
    parent: 'gameContainer',
    mode: Phaser.Scale.FIT,
    width: width,
    height: height,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Game],
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  }
})