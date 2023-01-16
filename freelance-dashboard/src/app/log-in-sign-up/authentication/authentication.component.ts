import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService, User} from '@auth0/auth0-angular';
import {FreelancerService} from '../../../../generated';
import {Router} from '@angular/router';
import {EncryptionService} from '../../../core/services/encryption.service';
import {select, Store} from '@ngrx/store';
import {SetAuthStatus, SetFreelancer} from '../../../core/store/actions/auth.actions';
import {FetchPositions} from '../../../core/store/actions/position.actions';
import {Subject, takeUntil} from 'rxjs';
import * as authReducer from '../../../core/store/reducers/auth.reducers';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  constructor(private authService: AuthService,
              private freelancerService: FreelancerService,
              private router: Router,
              private encryptionService: EncryptionService,
              private store: Store) {
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (!!isAuth) {
        this.store.dispatch(SetAuthStatus({isAuthenticated: true}));
        this.authService.user$.subscribe(user => {
          this.freelancerService.checkFreelancer(this.constructFreelancer(user, true)).subscribe(isAlreadyRegistered => {
            if (isAlreadyRegistered) {
              this.store.dispatch(SetFreelancer({freelancer: this.constructFreelancer(user, false)}));
              this.store.dispatch(FetchPositions());
              this.router.navigate(['main']);
            } else {
              this.router.navigateByUrl('signup', {
                state:
                  {
                    isRedirected: true,
                    user: user?.email
                  }
              });
            }
          });
        });
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  private constructFreelancer(user: User | null | undefined, withSensitiveData: boolean) {
    if (user === null || user === undefined) {
      throw new Error('Required parameter freelancer was null or undefined when calling checkFreelancer.');
    }
    return {
      name: user?.name,
      firstname: user?.given_name,
      lastname: user?.family_name,
      email: withSensitiveData ? this.encryptionService.encrypt(<string>user?.email) : user?.email,
      picture: user?.picture
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

}
