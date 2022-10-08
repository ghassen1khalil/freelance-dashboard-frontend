import {ChangeDetectionStrategy, Component, ContentChildren, Input, OnInit, QueryList} from '@angular/core';
import {AccordionItem} from './directives/accordion-item.directive';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'g-accordion',
  templateUrl: './dashboard-accordion.component.html',
  styleUrls: ['./dashboard-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('contentExpansion', [
      state('expanded', style({height: '*', opacity: 1, visibility: 'visible'})),
      state('collapsed', style({height: '0px', opacity: 0, visibility: 'hidden'})),
      transition('expanded <=> collapsed',
        animate('200ms cubic-bezier(.37,1.04,.68,.98)')),
    ])
  ]
})
export class DashboardAccordionComponent implements OnInit {

  expanded = new Set<number>();
  /**
   * Decides if the single item will be open at once or not.
   * In collapsing mode, toggling one would collapse others
   */
  @Input() collapsing = true;

  @ContentChildren(AccordionItem) items: QueryList<AccordionItem>;

  constructor() { }

  ngOnInit(): void {
  }

  toggleState = (index: number) => {
    if (this.expanded.has(index)) {
      this.expanded.delete(index);
    } else {
      if (this.collapsing) {
        this.expanded.clear();
      }
      this.expanded.add(index);
    }
  };

}
