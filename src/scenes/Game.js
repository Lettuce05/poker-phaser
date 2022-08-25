import Phaser from 'phaser';
import cardsDef from '@/assets/cards.json';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  init() {

  }

  preload() {
    this.load.multiatlas('cards', cardsDef, 'src/assets');
  }

  create() {
    this.add.image(this.scale.width * 0.5, this.scale.height * 0.5, 'cards', 'D7.png');
  }

  update() {

  }
}