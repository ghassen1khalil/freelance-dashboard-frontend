import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {getLoader} from '../store/reducers/loader.reducers';
import {SetLoader} from '../store/actions/loader.actions';

@Injectable({
  providedIn: 'root'
})
export class LoaderManagerService {

  constructor(private store: Store) {
  }

  public handleLoader(targetState: boolean): void {
    this.store.pipe(
      select(getLoader)
    ).subscribe((loaderState: boolean) => {
      if (loaderState !== targetState) {
        this.store.dispatch(SetLoader({isLoaderShown: targetState}))
      }
    }).unsubscribe();
  }
}
