import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Department } from '../../models';
import { DepartmentService } from './departments.service';
import { DepartmentSortableHeader, SortEvent } from './sortable.directive';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    DepartmentSortableHeader,
    NgbPaginationModule,
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
  providers: [DepartmentService, DecimalPipe],
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  departments$: Observable<Department[]>;
  total$: Observable<number>;
  @ViewChildren(DepartmentSortableHeader) headers?: QueryList<DepartmentSortableHeader>;

  constructor(public readonly departmentService: DepartmentService) {
    this.departments$ = departmentService.departments$;
    this.total$ = departmentService.total$;
  }

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments() {
    this.departmentService.findAll().subscribe((departments) => {
      this.departments = departments;
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers?.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.departmentService.sortColumn = column;
    this.departmentService.sortDirection = direction;
  }
}
