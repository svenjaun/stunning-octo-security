import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/shared/models/loginRequest.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['member']);
    }
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      alert("Invalid")
      return;
    }

    const loginRequest = new LoginRequest();
    loginRequest.username = this.loginForm.controls.username.value;
    loginRequest.password = this.loginForm.controls.password.value;

    this.authService.login(loginRequest);

    this.authService.messageSubject.subscribe(() => {
      this.router.navigate(['member']);
    })
  }

  register() {
      this.router.navigate(['register']);
  }
}
