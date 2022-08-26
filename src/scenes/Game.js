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


    // this.flipCards(this.cardObjects, 0, ['H3.png', 'HA.png', 'D2.png', 'C8.png', 'SJ.png'], 0);
    let testCards = [this.cardObjects[0], this.cardObjects[2], this.cardObjects[4]];
    // NOTE: check if cards are flipping and set to true before flipping
    // if (testCards.every(card => !card.isFlipping)) {
    //   testCards.forEach(card => {
    //     card.isFlipping = true;
    //   })
    //   this.flipCards(testCards, 0, ['H3.png', 'HA.png', 'D2.png'], 0);
    // }

    // this.flipCards(this.cardObjects[0], 0, ['H3.png'], 0);


    // this.input.on('gameobjectdown', this.handleClick);
  }

  update() {

  }

  // check if card is flipping and set to true before calling
  flipCards(gameObjects, flipNum, frames, delay) {
    // first tween: we raise and flip the card
    this.tweens.add({
      targets: gameObjects,
      duration: this.FLIP_SPEED / 2,
      delay: delay,
      scaleX: 0,
      scaleY: this.FLIP_ZOOM * cardScale[this.displaySize],
      ease: 'Linear',
      onCompleteParams: [flipNum, frames],
      onComplete: function(tween, targets, flipNum, frames) {
        if (flipNum > 0) {
          targets.forEach((card, index) => {
            card.setFrame(frames[index]);
          })

        } else {
          targets.forEach((card) => {
            card.setFrame('back.png');
          })
        }
        this.parent.scene.backFlipTween.play();

      }
    });


    this.backFlipTween = this.tweens.add({
      targets: gameObjects,
      duration: this.FLIP_SPEED / 2,
      scaleX: cardScale[this.displaySize],
      scaleY: cardScale[this.displaySize],
      paused: true,
      ease: 'Linear',
      onCompleteParams: [flipNum, frames],
      onComplete: function(tween, targets, flipNum, frames) {
        if (flipNum > 0) {
          targets.forEach(card => {
            card.isFlipping = false;
          })
        } else {
          this.parent.scene.flipCards(targets, 1, frames, 200)
        }

      }
    })


  }

}