let currentPlayerPrint = document.getElementById('currentPlayer');
let gameCommentDiv = document.getElementById('gameComment');
let para = document.createElement("p");

const name_secret = Symbol();
const points_secret = Symbol();
class Player {
  constructor(name) {
    this[name_secret] = name;
    this[points_secret] = 0;
  }
  getName() {
    return this[name_secret];
  }
  getPoints() {
    return this[points_secret];
  }
  incrementPoints() {
    this[points_secret] += 1;
  }
}

class Game {
  constructor(players) {
    this.card_content = [1, 1, 2, 2, 3, 3];
    this.cards = document.getElementsByClassName('flip-card');
    this.players = players;
    this.currentPlayer = players[0];
    this.tryNo = 0;
    this.openedCards = [];
    this.discoveredCards = [];
    this.shuffle();
    this.initGame();
  }

  initGame() {
    currentPlayerPrint.innerHTML = this.currentPlayer.getName();
    Array.from(this.cards).forEach((card, index) => {
      let p = card.getElementsByClassName('card-text')[0];
      p.innerHTML = this.card_content[index];
      setTimeout(() => {
        card.addEventListener('click', () => {
          this.onCardClick(index, card);
        })
      }, 0);
    });
  }

  shuffle() {
    let a = this.card_content;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  onCardClick(cardIndex, card) {
    if(this.tryNo < 2) {
      if(this.discoveredCards.includes(cardIndex)) {
        return;
      } else {
        if(this.openedCards.includes(cardIndex)) {
          return;
        } else {
          this.tryNo += 1;
          this.openedCards.push(cardIndex);
          let flip_card_inner = card.getElementsByClassName('flip-card-inner');
          flip_card_inner[0].classList.toggle('rotate-card');

          if(this.tryNo == 2) {
            this.tryNo = 0;
            if(this.isDiscovered()) {
              this.discoveredCards.push(this.openedCards[0]);
              this.discoveredCards.push(this.openedCards[1]);
              this.currentPlayer.incrementPoints();
              
              para.innerHTML = "SCORE!!!";
              gameCommentDiv.appendChild(para);
              para.innerHTML = this.currentPlayer.getName() + " points = " + this.currentPlayer.getPoints()
              gameCommentDiv.appendChild(para);

              if(this.currentPlayer == this.players[0]) {
                let scoreSpan = document.getElementById('p1-points');
                scoreSpan.innerHTML = this.currentPlayer.getPoints();
              } else {
                let scoreSpan = document.getElementById('p2-points');
                scoreSpan.innerHTML = this.currentPlayer.getPoints();
              }

              this.openedCards = [];
              if(this.discoveredCards.length == 6) {
                para.innerHTML = "GAME OVER!!!"
                gameCommentDiv.appendChild(para);
                this.showWinner();
              }
            } else {
              setTimeout(() => {
                this.changePlayer();
                for(let no of this.openedCards) {
                  this.cards[no].getElementsByClassName('flip-card-inner')[0].classList.toggle('rotate-card');
                }
                this.openedCards = [];
              }, 1000);
            }
          }
        }
      }
    }
  }

  changePlayer() {
    if(this.currentPlayer == this.players[0]) {
      this.currentPlayer = this.players[1];
    } else {
      this.currentPlayer = this.players[0];
    }
    currentPlayerPrint.innerHTML = this.currentPlayer.getName();
  }

  isDiscovered() {
    if(this.openedCards.length == 2) {
      if(this.cards[this.openedCards[0]].getElementsByClassName('card-text')[0].innerHTML == this.cards[this.openedCards[1]].getElementsByClassName('card-text')[0].innerHTML) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  showWinner() {
    if(this.players[0].getPoints() > this.players[1].getPoints()) {
      para.innerHTML = this.players[0].getName() + " wins with " + this.players[0].getPoints() + " points";
      gameCommentDiv.appendChild(para);
    } else {
      para.innerHTML = this.players[1].getName() + " wins with " + this.players[1].getPoints() + " points";
      gameCommentDiv.appendChild(para);
    }
  }
}

let player1 = new Player("Player1");
let player2 = new Player("Player2");
let game = new Game([player1, player2]);
