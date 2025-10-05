import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {CheckPasswordResetToken} from '../../../core/store/actions/password-reset-token.actions';
import {getPasswordResetToken} from '../../../core/store/reducers/password-reset-token.reducers';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  public isRequestSent: boolean;
  public isTokenValid: boolean;

  public passwordResetToken: string;
  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(getPasswordResetToken),
      takeUntil(this.unsubscribe$)
    ).subscribe(state => {
      this.isTokenValid = state.isTokenValid;
    });
    this.extractTokenFromRoute();
  }

  private extractTokenFromRoute() {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.passwordResetToken = params['token']
        this.store.dispatch(CheckPasswordResetToken({
            passwordResetToken: this.passwordResetToken
          }
        ));
      }
    });
  }

  public onRequestSent() {
    this.isRequestSent = true;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
