import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {Position} from '../../../../generated';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit, AfterViewInit {

  @Input() title: string;
  @Input() expanded: boolean;
  @Input() positions: Position[];

  contentHeight: string;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.calculateContentHeight();
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }

  calculateContentHeight() {
    const contentElement = this.elementRef.nativeElement.querySelector('.accordion-content');
    this.contentHeight = contentElement.scrollHeight + 'px';
  }

}
