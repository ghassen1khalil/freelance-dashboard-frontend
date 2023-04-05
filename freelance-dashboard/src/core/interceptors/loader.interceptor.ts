import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {SetLoader} from '../store/actions/loader.actions';
import {LoaderManagerService} from '../services/loader-manager.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private store: Store,
              private loaderManager: LoaderManagerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/api')) {
      //this.store.dispatch(SetLoader({isLoaderShown: true}));
      this.loaderManager.handleLoader(true);
      return next.handle(request).pipe(
        finalize(() => {
          /*this.store.dispatch(SetLoader({isLoaderShown: false}))*/
          this.loaderManager.handleLoader(false);
        })
      );
    } else {
      return next.handle(request);
    }

  }
}
