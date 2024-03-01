import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../../models';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  private readonly employeeService: EmployeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.employeeService.findAll().subscribe((employees) => {
      this.employees = employees;
    });
  }
}
