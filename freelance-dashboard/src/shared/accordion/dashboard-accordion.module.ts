import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { DashboardAccordionComponent } from "./dashboard-accordion.component";
import { AccordionItem } from "./directives/accordion-item.directive";
import { AccordionContent } from "./directives/accordion-content.directive";
import { AccordionTitle } from "./directives/accordion-title.directive";
import { AccordionHeader } from "./directives/accordion-header.directive";
import {TogglePipe} from './pipe/toggle.pipe'

@NgModule({
  declarations: [
    DashboardAccordionComponent,
    AccordionItem,
    AccordionContent,
    AccordionTitle,
    AccordionHeader,
    TogglePipe
  ],
  imports: [CommonModule],
  exports: [
    DashboardAccordionComponent,
    AccordionItem,
    AccordionContent,
    AccordionTitle,
    AccordionHeader
  ]
})
export class DashboardAccordionModule {}
