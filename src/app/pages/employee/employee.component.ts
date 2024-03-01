import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../../models';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {
  employees: Employee[] = [];
}
