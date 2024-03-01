import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Department } from '../../models';
import { DepartmentsService } from './departments.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
})
export class DepartmentsComponent {
  departments: Department[] = [];

  constructor(private departmentService: DepartmentsService) {
    afterNextRender(() => {
      this.getDepartments();
    });
  }

  getDepartments() {
    this.departmentService.findAll().subscribe((departments) => {
      this.departments = departments;
    });
  }
}
