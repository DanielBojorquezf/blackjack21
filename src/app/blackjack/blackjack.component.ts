import { Component, OnInit } from '@angular/core';
import { BlackjackService } from '../services/blackjack.service';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.scss']
})
export class BlackjackComponent implements OnInit {
  playerCards: string[] = [];
  dealerCards: string[] = [];
  playerHandValue: number = 0;
  dealerHandValue: number = 0;
  playerBet: number = 0;
  playerBank: number = 1000; // Example starting bank
  playerPoints = 0;
  dealerPoints = 0;
  winner = 'Pending';
  playerTurn = true;
  playerHasAce = false;
  dealerHasAce = false;

  constructor(private blackjackService: BlackjackService) { }

  ngOnInit(): void {
    this.startGame();
  }

  startGame() {
    this.winner = 'Pending';
    this.playerTurn = true;
    this.playerCards = this.blackjackService.dealCards();
    this.dealerCards = this.blackjackService.dealCards();
    this.updateHandValues();

    // verify if player has blackjack
    if (this.isBlackjack(this.playerCards)) {
      this.playerTurn = false;
      this.determineWinner();
    }
  }

  hit() {
    this.playerCards.push(this.blackjackService.dealCard());
    this.updateHandValues();

    // player bust
    if (this.playerHandValue > 21) {
      this.playerTurn = false;
      this.determineWinner();
    }
  }

  stand() {
    this.playerTurn = false;
    this.dealerPlay();
  }

  doubleDown() {
    this.playerBet *= 2;
    this.hit();
    this.stand();
  }

  split() {
    // Implement split logic
  }

  surrender() {
    this.playerBank += this.playerBet / 2;
    this.startGame();
  }

  insurance() {
    // Implement insurance logic
  }

  canSplit(): boolean {
    return this.playerCards.length === 2 && this.playerCards[0] === this.playerCards[1];
  }

  canTakeInsurance(): boolean {
    return this.dealerCards[0].includes('ace');
  }

  updateHandValues() {
    this.playerHandValue = this.calculateHandValue(this.playerCards);
    this.dealerHandValue = this.calculateHandValue(this.dealerCards);

    // Verify five card charlie for player only
    if (this.playerCards.length === 5) {
      this.determineWinner();
    }

    // Check if player or dealer has an ace
    this.playerHasAce = this.playerCards.some(card => card.includes('ace'));
    this.dealerHasAce = this.dealerCards.some(card => card.includes('ace'));
  }

  calculateHandValue(cards: string[]): number {
    let total = 0;
    let aceCount = 0;

    for (const card of cards) {
      let value = card.split('_')[0];
      if (value === 'ace') {
        aceCount++;
        total += 1;
      } else if (['jack', 'queen', 'king'].includes(value)) {
        total += 10;
      } else {
        total += parseInt(value);
      }
    }

    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }

    return total;
  }

  dealerPlay() {
    this.dealerHandValue = this.calculateHandValue(this.dealerCards);
    
    while (this.dealerHandValue < 17 || (this.dealerHasAce && this.dealerHandValue + 10 < 17 && this.dealerHandValue + 10 <= 21)) {
      const newCard = this.blackjackService.dealCard();
      this.dealerCards.push(newCard);
      this.dealerHandValue = this.calculateHandValue(this.dealerCards);

      if (this.dealerHandValue > 21) {
        break;
      }
    }

    // Optionally, implement soft 17 logic
    if (this.dealerHandValue === 17 && this.isSoft17(this.dealerCards)) {
      const newCard = this.blackjackService.dealCard();
      this.dealerCards.push(newCard);
      this.dealerHandValue = this.calculateHandValue(this.dealerCards);
    }
    this.determineWinner();
  }

  determineWinner() {
    // validate if player or dealer has ace and 10 value if the total would be 21 or less
    if (this.playerHasAce && this.playerHandValue + 10 <= 21) {
      this.playerHandValue += 10;
    }

    if (this.dealerHasAce && this.dealerHandValue + 10 <= 21) {
      this.dealerHandValue += 10;
    }

    if (this.isFiveCardCharlie(this.playerCards)) {
      this.winner = 'Player wins with a five card charlie!';
    } else if (this.isBlackjack(this.playerCards) && !this.isBlackjack(this.dealerCards)) {
      this.winner = 'Player has Blackjack and wins!';
    } else if (!this.isBlackjack(this.playerCards) && this.isBlackjack(this.dealerCards)) {
      this.winner = 'Dealer has Blackjack and wins!';
    } else if (this.playerHandValue > 21) {
      this.winner = 'Player busts, dealer wins!';
    } else if (this.dealerHandValue > 21) {
      this.winner = 'Dealer busts, player wins!';
    } else if (this.playerHandValue > this.dealerHandValue) {
      this.winner = 'Player wins with higher cards!';
    } else if (this.dealerHandValue > this.playerHandValue) {
      this.winner = 'Dealer wins with higher cards!';
    } else if (this.playerHandValue === this.dealerHandValue) {
      this.winner = 'Push: Both player and dealer have the same value!';
    }
  }

  isBlackjack(cards: string[]): boolean {
    return this.calculateHandValue(cards) === 21 && cards.length === 2;
  }

  isSoft17(cards: string[]): boolean {
    // Implement soft 17 logic
    return false;
  }

  isFiveCardCharlie(cards: string[]): boolean {
    return cards.length === 5 && this.calculateHandValue(cards) <= 21;
  }
}
