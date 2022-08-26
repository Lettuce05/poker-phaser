import Phaser from 'phaser';
import cardsDef from '@/assets/cards.json';
import { cardScale, cardPositions } from '@/display.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }
  displaySize;
  init() {
    // set background color
    this.mainCamera = this.cameras.add(0, 0);
    this.mainCamera.setBackgroundColor('#3D7AD6');
    if (window.innerWidth < 1000) {
      this.displaySize = 'small';
    } else {
      this.displaySize = 'big';
    }
  }

  preload() {
    this.load.multiatlas('cards', cardsDef, 'src/assets');
    this.cardObjects = [];
  }

  create() {

    for (let i = 0; i < 5; i++) {
      let card = this.add.image(this.scale.width * cardPositions[i][this.displaySize], this.scale.height * 0.5, 'cards', 'S7.png').setScale(cardScale[this.displaySize]);
      card.cardId = i;
      this.cardObjects.push(card);
    }

  }

  update() {

  }
}