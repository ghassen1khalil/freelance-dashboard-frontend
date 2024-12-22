import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  standalone: true,
  imports: [
    NgStyle
  ]
})
export class DrawerComponent implements OnInit {

  // Inputs for configuration
  @Input() position: 'left' | 'right' = 'left'; // Default to left side
  @Input() visible: boolean = false; // Control visibility
  @Input() width: string = '300px'; // Default width
  @Input() closeOnOutsideClick: boolean = true; // Close when clicking outside

  // Output event for toggling visibility
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Dynamic classes for animations and positioning
  @HostBinding('class.open') get isOpen() { return this.visible; }
  @HostBinding('class.left') get isLeft() { return this.position === 'left'; }
  @HostBinding('class.right') get isRight() { return this.position === 'right'; }

  constructor() { }

  ngOnInit(): void {
  }

  closeDrawer() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onOverlayClick(event: MouseEvent) {
    if (this.closeOnOutsideClick) {
      this.closeDrawer();
    }
  }

}
