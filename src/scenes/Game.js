import Phaser from 'phaser';
import cardsDef from '@/assets/cards.json';
import drawUrl from '@/assets/draw.png';
import heldUrl from '@/assets/held.png';
import { cardScale, cardPositions, drawScale, drawPos, heldPos } from '@/display.js';
import Deck from '@/deck.js';
import { cards, cardBack } from '@/cards.js';
import { isRoyalFlush } from '@/poker.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  displaySize;
  FLIP_SPEED = 200;
  FLIP_ZOOM = 1.2;
  drawCount = -1;
  deck;
  credits;
  unheldCards;

  init() {
    if (window.innerWidth < 1000) {
      this.displaySize = 'small';
    } else {
      this.displaySize = 'big';
    }

    this.deck = new Deck(cards);
    this.deck.shuffle();

    this.credits = 30;
    this.unheldCards = [0, 1, 2, 3, 4];
  }

  preload() {
    this.load.multiatlas('cards', cardsDef, 'src/assets');
    this.load.image('draw', drawUrl);
    this.load.image('held', heldUrl);
    this.cardObjects = [];
    this.heldObjects = [];
  }

  create() {
    // add cards to scene
    for (let i = 0; i < 5; i++) {
      let card = this.add.image(this.scale.width * cardPositions[i][this.displaySize], this.scale.height * 0.5, 'cards', 'back.png').setScale(cardScale[this.displaySize]);

      card.cardId = i;
      card.isFlipping = false;
      card.setInteractive();
      this.cardObjects.push(card);

      let heldText = this.add.image(this.scale.width * cardPositions[i][this.displaySize], this.scale.height * heldPos[this.displaySize], 'held').setScale(cardScale[this.displaySize]);
      heldText.setAlpha(0);
      this.heldObjects.push(heldText);
    }

    // add draw btn to screen
    this.drawBtn = this.add.image(this.scale.width * drawPos[this.displaySize].x, this.scale.height * drawPos[this.displaySize].y, 'draw').setScale(drawScale[this.displaySize]);
    this.drawBtn.setInteractive();


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


    this.input.on('gameobjectdown', this.handleClick);
  }

  handleClick(pointer, object) {
    if (object.texture.key === 'draw') {
      this.scene.handleDraw();
    } else if (object.texture.key === 'cards') {
      this.scene.handleHeld(object);
    }
  }

  handleHeld(card) {
    if (this.drawCount !== 1) {
      return;
    }
    let newUnHeld = Array.from(this.unheldCards);
    if (newUnHeld.includes(card.cardId)) {
      newUnHeld = newUnHeld.filter(cardId => cardId !== card.cardId);
      this.heldObjects[card.cardId].setAlpha(1);
    } else {
      newUnHeld.push(card.cardId);
      this.heldObjects[card.cardId].setAlpha(0);
    }
    this.unheldCards = newUnHeld;
  }

  handleDraw() {
    // initial draw
    if (this.drawCount === -1) {
      if (this.cardObjects.every(card => !card.isFlipping)) {
        this.cardObjects.forEach(card => {
          card.isFlipping = true;
        });
        this.credits = this.credits - 1;
        let frames = this.deck.draw(this.cardObjects.length);
        frames = frames.map((card) => card.img);
        this.drawCount = 1;
        this.flipCards(this.cardObjects, 1, frames, 0);
      } else {
        return;
      }

    } else if (this.drawCount === 1) {
      let unheldCardObjects = this.unheldCards.map((cardId) => this.cardObjects[cardId]);
      if (unheldCardObjects.every(card => !card.isFlipping)) {
        unheldCardObjects.forEach(card => {
          card.isFlipping = true;
        });
        let frames = this.deck.draw(unheldCardObjects.length);
        frames = frames.map((card) => card.img);
        this.drawCount = 2;
        this.flipCards(unheldCardObjects, 0, frames, 0);
        let heldFrames = this.cardObjects.map((card) => {
          if (!this.unheldCards.includes(card.cardId)) {
            return card.frame.name;
          }
        });
        heldFrames = heldFrames.filter(frame => {
          if (frame) {
            return true;
          }
          return false;
        });
        this.checkWin(heldFrames.concat(frames));
      } else {
        return;
      }
    }
  }

  checkWin(frames) {
    let finalCards = Array.from(cards);
    finalCards = finalCards.filter(card => frames.includes(card.img));

    if (isRoyalFlush(finalCards)) {
      console.log("hand is royal flush!!!");
    }

    this.drawCount = 0;
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