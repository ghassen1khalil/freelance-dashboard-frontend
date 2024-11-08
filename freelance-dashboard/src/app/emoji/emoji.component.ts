import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-emoji',
  template: `<span [style.fontSize.px]="size">{{ emoji }}</span>`,
  styleUrls: ['./emoji.component.scss'],
  standalone: true
})
export class EmojiComponent implements OnInit {

  @Input() emoji: string = '😊'; // Emoji par défaut
  @Input() size: number = 24; // Taille par défaut

  constructor() { }

  ngOnInit(): void {
  }

}
