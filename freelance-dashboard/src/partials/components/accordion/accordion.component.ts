import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, OnInit} from '@angular/core';
import {Position} from '../../../../generated';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit, AfterViewChecked {

  @Input() title: string;
  @Input() positions: Position[];
  @Input() isArchive: boolean;
  @Input() onlyArchived: boolean;
  @Input() isLatestYear: boolean;

  expanded: boolean;
  contentHeight: string;
  sortedPositions: Position[];

  constructor(private elementRef: ElementRef, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.sortedPositions = this.sortByStartingDate(this.positions);
    if (this.isArchive) {
      this.expanded = this.onlyArchived;
    } else {
      this.expanded = this.isLatestYear;
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
    const mutablePositions = [...positions]; // Create a shallow copy
    return mutablePositions.sort((a, b) => {
      const timeA = new Date((a.startingDate) as string).getTime();
      const timeB = new Date((b.startingDate) as string).getTime();
      if (timeA === timeB) {
        return 0;
      }
      return timeB - timeA;
    });
  }


}
