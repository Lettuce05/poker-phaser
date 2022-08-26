import Phaser from 'phaser';
import cardsDef from '@/assets/cards.json';
import { cardScale, cardPositions } from '@/display.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  displaySize;
  FLIP_SPEED = 200;
  FLIP_ZOOM = 1.2;

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
      card.isFlipping = false;
      this.cardObjects.push(card);
    }


    this.flipCard(this.cardObjects, 0, `HA.png`, 0);


    // this.input.on('gameobjectdown', this.handleClick);
  }

  update() {

  }

  // check if card is flipping and set to true before calling
  flipCard(gameObject, flipNum, frame, delay) {
    // first tween: we raise and flip the card
    this.tweens.add({
      targets: gameObject,
      duration: this.FLIP_SPEED / 2,
      delay: delay,
      scaleX: 0,
      scaleY: this.FLIP_ZOOM * cardScale[this.displaySize],
      ease: 'Linear',
      onCompleteParams: [flipNum, frame],
      onComplete: function(tween, targets, flipNum, frame) {
        let card = targets[0];
        if (flipNum > 0) {
          card.setFrame(frame);
        } else {
          card.setFrame('back.png');
        }
        this.parent.scene.backFlipTween.play();

      }
    });


    this.backFlipTween = this.tweens.add({
      targets: gameObject,
      duration: this.FLIP_SPEED / 2,
      scaleX: cardScale[this.displaySize],
      scaleY: cardScale[this.displaySize],
      paused: true,
      ease: 'Linear',
      onCompleteParams: [flipNum, frame],
      onComplete: function(tween, targets, flipNum, frame) {
        let card = targets[0];
        if (flipNum > 0) {
          card.isFlipping = false;
        } else {
          this.parent.scene.flipCard(card, 1, frame, 200)
        }

      }
    })


  }

}