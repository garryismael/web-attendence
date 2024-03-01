import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { Department } from '../../models';
import { DepartmentsService } from './departments.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzUploadModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    ReactiveFormsModule,
  ],
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
