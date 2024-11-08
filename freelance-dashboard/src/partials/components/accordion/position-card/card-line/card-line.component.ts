import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card-line',
  templateUrl: './card-line.component.html',
  styleUrls: ['./card-line.component.scss']
})
export class CardLineComponent implements OnInit {

  @Input()
  public emoji: string;

  @Input()
  public size: string;

  @Input()
  public text: string;


  constructor() {
    if (this.size === null || this.size === undefined) {
      this.size = '20';
    }

  }

  ngOnInit(): void {
  }

}
