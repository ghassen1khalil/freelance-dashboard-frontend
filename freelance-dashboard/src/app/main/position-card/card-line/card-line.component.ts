import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card-line',
  templateUrl: './card-line.component.html',
  styleUrls: ['./card-line.component.scss']
})
export class CardLineComponent implements OnInit {

  @Input()
  public emojiName: string;

  @Input()
  public size: string;

  @Input()
  public text: string;


  constructor() {
  }

  ngOnInit(): void {
  }

}
