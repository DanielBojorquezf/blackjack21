import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlackjackService {
  private deck: string[] = [];
  private suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  private ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];

  constructor() {
    this.initializeDeck();
  }

  private initializeDeck() {
    this.deck = [];
    for (let suit of this.suits) {
      for (let rank of this.ranks) {
        this.deck.push(`${rank}_of_${suit}`);
      }
    }
    this.shuffleDeck();
  }

  private shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCard(): string {
    return this.deck.pop()!;
  }

  dealCards(): string[] {
    return [this.dealCard(), this.dealCard()];
  }
}
