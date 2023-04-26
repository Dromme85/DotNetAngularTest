import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent implements OnInit, OnChanges {

  public ccNumber?: string;
  public savedCCNumbers: string[] = [];
  public isHidden: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges -', changes);
  }

  onSubmitCC() {
    if (this.ccNumber) {
      this.ccNumber.trim();
      this.isHidden = true;
      this.savedCCNumbers.unshift(this.ccNumber);
      this.ccNumber = undefined;
    }

  }

  resetCC() {
    this.isHidden = false;
  }

}
