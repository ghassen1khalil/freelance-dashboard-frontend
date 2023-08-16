import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, OnInit} from '@angular/core';
import {Position} from '../../../../generated';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit, AfterViewChecked {

  @Input() title: string;
  @Input() isLatestYear: boolean; /*DEPRECATED*/
  @Input() positions: Position[];
  @Input() isArchive: boolean;
  @Input() isNoActivePositions: boolean;

  expanded: boolean;

  contentHeight: string;

  constructor(private elementRef: ElementRef, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.isArchive) {
      this.expanded = this.isNoActivePositions;
    } else {
      this.expanded = true;
      this.calculateContentHeight();
      this.cdRef.detectChanges();
    }
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
