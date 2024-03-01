import { CommonModule } from '@angular/common';
import { Component, OnInit, afterNextRender, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Department } from '../../models';
import { DepartmentService } from './departments.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  private readonly departmentService: DepartmentService = inject(DepartmentService);

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments() {
    this.departmentService.findAll().subscribe((departments) => {
      this.departments = departments;
    });
  }
}
