import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { Employee } from '../../models';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    NzTableModule,
    NzUploadModule,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {
  employees: Employee[] = [];
}
