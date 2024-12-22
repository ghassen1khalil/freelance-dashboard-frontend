import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear: number;
  appName: string;

  constructor() { }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.appName = 'Freelance Dashboard'; // You can also fetch this from a service or environment file
  }
}
