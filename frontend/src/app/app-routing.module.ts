import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {AdminComponent} from './components/admin/admin.component';
import {MemberComponent} from './components/member/member.component';
import {RegisterComponent} from './components/register/register.component';


const routes: Routes = [
  {
  path: '',
  redirectTo: '/login',
  pathMatch: 'full',
},
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full',
  },
  {
    path: 'member',
    component: MemberComponent,
    pathMatch: 'full',
  },
  {
    path: 'command',
    component: AdminComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
