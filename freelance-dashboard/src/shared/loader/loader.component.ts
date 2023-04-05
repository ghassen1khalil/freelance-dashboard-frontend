import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {getLoader} from '../../core/store/reducers/loader.reducers';
import {BlockUIModule} from 'primeng/blockui';
import {PrimeNGConfig} from 'primeng/api';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, DialogModule, ProgressSpinnerModule, BlockUIModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  public showLoader: boolean;

  private unsubscribe$ = new Subject<void>();


  constructor(private store: Store, private primengConfig: PrimeNGConfig) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.store.pipe(
      select(getLoader),
      takeUntil(this.unsubscribe$)
    ).subscribe(isLoaderShown => this.showLoader = isLoaderShown);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

}
