import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, OnInit} from '@angular/core';
import {Position} from '../../../../generated';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit, AfterViewChecked {

  @Input() title: string;
  @Input() isLatestYear: boolean;
  @Input() positions: Position[];

  expanded = true;

  contentHeight: string;

  constructor(private elementRef: ElementRef, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.calculateContentHeight();
    this.cdRef.detectChanges();
  }

  public toggleAccordion() {
    this.expanded = !this.expanded;
  }

  ngAfterViewChecked() {
    this.calculateContentHeight();
    this.cdRef.detectChanges();
  }

  private calculateContentHeight() {
    const contentElement = this.elementRef.nativeElement.querySelector('.accordion-content');
    this.contentHeight = contentElement.scrollHeight + 'px';
  }

  public sortByStartingDate(positions: Position[]): Position[] {
    return positions.sort((a, b) =>
      new Date((b.startingDate) as string).getTime() - new Date((a.startingDate) as string).getTime());
  }


}
