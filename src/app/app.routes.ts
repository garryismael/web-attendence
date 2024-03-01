import { Routes } from '@angular/router';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DepartmentsComponent } from './pages/departments/departments.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'attendances',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'departments',
        component: DepartmentsComponent,
      },
      {
        path: 'employees',
        component: EmployeeComponent,
      },
      {
        path: 'attendances',
        component: AttendanceComponent,
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
