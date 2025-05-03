import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService, User} from '@auth0/auth0-angular';
import {FreelancerService} from '../../../../generated';
import {Router} from '@angular/router';
import {EncryptionService} from '../../../core/services/encryption.service';
import {Store} from '@ngrx/store';
import {SetAuthStatus, SetFreelancer} from '../../../core/store/actions/auth.actions';
import {FetchPositions} from '../../../core/store/actions/position.actions';
import {Subject} from 'rxjs';
import {LoaderManagerService} from '../../../core/services/loader-manager.service';

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
              private store: Store,
              private loaderManager: LoaderManagerService) {
  }

  ngOnInit(): void {
    this.loaderManager.handleLoader(true);
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (!!isAuth) {
        this.store.dispatch(SetAuthStatus({isAuthenticated: true}));
        this.authService.user$.subscribe(user => {
          this.freelancerService.getFreelancerByEmail(user?.email!).subscribe(freelancer => {
            if (freelancer) {
              this.store.dispatch(SetFreelancer({freelancer: this.constructFreelancer(user)}));
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

  private constructFreelancer(user: User | null | undefined) {
    if (user === null || user === undefined) {
      throw new Error('Required parameter freelancer was null or undefined when calling checkFreelancer.');
    }
    return {
      name: user?.name,
      firstname: user?.given_name,
      lastname: user?.family_name,
      email: user?.email,
      picture: user?.picture
    }
  }

  ngOnDestroy(): void {
    this.loaderManager.handleLoader(false);
    this.unsubscribe$.complete();
  }

}
