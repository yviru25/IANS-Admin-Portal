import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ApiService } from 'src/app/shared/services/api.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, 
    private router: Router, public authenticationService: AuthenticationService, 
    public authFackservice: AuthfakeauthenticationService, private service: ApiService,
    private sprinner: NgxSpinnerService) { }

  ngOnInit() {
    document.body.removeAttribute('data-layout');
    document.body.classList.add('auth-body-bg');

    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      userPassword: ['', [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.login(this.f.email.value, this.f.password.value).then((res: any) => {
          this.router.navigate(['/']);
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        this.authFackservice.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate(['/']);
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }

  onLoggedIn() {
    console.log(this.loginForm.value);
    this.sprinner.show();
    this.service.sendPostFormRequest('login', this.loginForm.value).subscribe(
      res => {
        this.sprinner.hide();
        // console.log(res);
        this.router.navigate(['/']);
      },
      error => {
        this.sprinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Username or Password not valid'
        })
      }


     /*  console.log(res);
      this.sprinner.hide();
      if(res.status == '"Username or Password not valid') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please check your username and password!'
        })
      } else {
        this.router.navigate(['/']);
      } */
      
  )
   /*  if(this.loginForm.valid) {
      this.sprinner.hide();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please check your username and password!'
      })
    } else {
      this.service.sendPostFormRequest('login', this.loginForm).subscribe((res) => {
          this.sprinner.hide();
          this.router.navigate(['/']);
      })
    } */
  }

}
