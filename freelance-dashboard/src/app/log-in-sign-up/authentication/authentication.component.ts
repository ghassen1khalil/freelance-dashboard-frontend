import {Component, OnInit} from '@angular/core';
import {AuthService, User} from '@auth0/auth0-angular';
import {FreelancerService} from '../../../../generated';
import {Router} from '@angular/router';
import {EncryptionService} from '../../../core/services/encryption.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {


  constructor(private authService: AuthService,
              private freelancerService: FreelancerService,
              private router: Router,
              private encryptionService: EncryptionService) {
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.authService.user$.subscribe(user => {
          this.freelancerService.checkFreelancer(this.constructFreelancer(user)).subscribe(isAlreadyRegistered => {
            if (isAlreadyRegistered) {
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
        this.router.navigate(['login'])
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
      email: this.encryptionService.encrypt(<string>user?.email),
      picture: user?.picture
    }
  }

}
