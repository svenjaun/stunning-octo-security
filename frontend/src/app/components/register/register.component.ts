import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, switchMap} from 'rxjs/operators';
import {AuthService} from '../../shared/services/auth.service';
import {RegisterRequest} from '../../shared/models/registerRequest.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['member']);
    }
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      alert("Invalid")
      return;
    }

    const registerRequest = new RegisterRequest();
    registerRequest.username = this.registerForm.controls.username.value;
    registerRequest.email = this.registerForm.controls.email.value;
    registerRequest.password = this.registerForm.controls.password.value;

    this.authService.register(registerRequest);

    this.authService.messageSubject.subscribe(() => {
      this.router.navigate(['member']);
    })
  }
  login() {
      this.router.navigate(['login']);
  }
}
