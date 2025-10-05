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
import {PositionState} from '../../../generated';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input() title: string;
  @Input() public isExpanded: boolean;
  @Input() public positionState: PositionState;
  contentHeight: string;

  constructor(private elementRef: ElementRef, private cdRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateContentHeight();
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
  }

  public toggleAccordion() {
    this.isExpanded = !this.isExpanded;
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
