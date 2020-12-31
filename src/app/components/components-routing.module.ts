import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardManagementComponent } from './dashboard-management/dashboard-management.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard/:id', component: DashboardComponent, data: { state: 'dashboard' } },
  {
    path: 'dashboardManagement',
    canActivate: [AuthGuard],
    component: DashboardManagementComponent,
    data: { state: 'dashboardManagement' }
  },
  { path: '**', redirectTo: 'dashboardManagement' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule {}
