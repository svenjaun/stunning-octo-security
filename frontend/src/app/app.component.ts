import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor (private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {} 

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isBoss: boolean = false;

  ngOnInit(): void {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        console.log(this.authService.isUserLoggedIn());
        
        this.isLoggedIn = this.authService.isUserLoggedIn()
      }
    })
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(['login'])
  }

  command(): void {
    this.router.navigate(['command'])
  }

  member(): void {
    this.router.navigate(['member'])
  }
}
