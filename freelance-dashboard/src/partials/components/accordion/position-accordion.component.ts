import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {Position} from '../../../../generated';

@Component({
  selector: 'app-accordion',
  templateUrl: './position-accordion.component.html',
  styleUrls: ['./position-accordion.component.scss']
})
export class PositionAccordionComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input() title: string;
  @Input() positions: Position[];
  @Input() isArchive: boolean;
  @Input() onlyArchived: boolean;
  @Input() isLatestYear: boolean;

  expanded: boolean;
  contentHeight: string;

  constructor(private elementRef: ElementRef, private cdRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isArchive) {
      this.expanded = this.onlyArchived;
    } else {
      this.expanded = this.isLatestYear;
      this.calculateContentHeight();
      this.cdRef.detectChanges();
    }
  }

  ngOnInit(): void {}

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
}
