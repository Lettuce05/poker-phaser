import './style.css'
import Phaser from 'phaser';
import Game from '@/scenes/Game';

export default new Phaser.Game({
  type: Phaser.AUTO,
  scale: {
    parent: 'gameContainer',
    mode: Phaser.Scale.FIT,
    width: 1920,
    height: 1080,
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