import { ResourceLoader } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Member } from '../../shared/models/member.model';
import { BackendService } from '../../shared/services/backend.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  members: Member[] = [];
  loggedIn = false;
  isAdmin = false;
  isBoss = false;
  constructor(private backendService: BackendService, public authService: AuthService) {
  }

  ngOnInit() {
    this.loggedIn = this.authService.isUserLoggedIn();
    this.backendService.getRole().subscribe((res) => {
      this.isAdmin = res['role'] === "Octo_Boss" || res['role'] === "Octo_Admin";
      this.isBoss = res['role'] === "Octo_Boss";
    })
    this.reloadMember();

  }
  reloadMember() {
    this.backendService.getMembers().subscribe((members) => {
      this.members = members.map((member) => {
        /* INSERT IF ANGULAR DOESN'T HAD SANITIZING
          if (member.email) {
            member.email = member.email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
          }
          member.username = member.username.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        */
        return member
      });
    });
  }

  makeAdmin(email): void {
    this.backendService.grantAdmin(email).subscribe(() => {
      this.backendService.getMembers().subscribe((members) => {
        this.members = members;
      });
    });
  }

  takeAdmin(email): void {
    this.backendService.removeAdmin(email).subscribe(() => {
      this.backendService.getMembers().subscribe((members) => {
        this.members = members;
      });
    });
  }
}
