import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Employee } from '../../models';
import {
  EmployeeSortableHeader,
  SortEventEmployee,
} from './employee.directive';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    EmployeeSortableHeader,
    NgbPaginationModule,
  ],
  providers: [EmployeeService, DecimalPipe],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  employees$: Observable<Employee[]>;
  total$: Observable<number>;

  @ViewChildren(EmployeeSortableHeader)
  headers?: QueryList<EmployeeSortableHeader>;
  constructor(public readonly employeeService: EmployeeService) {
    this.employees$ = employeeService.employees$;
    this.total$ = employeeService.total$;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.employeeService.findAll().subscribe((employees) => {
      this.employees = employees;
    });
  }

  onSort({ column, direction }: SortEventEmployee) {
    // resetting other headers
    this.headers?.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.employeeService.sortColumn = column;
    this.employeeService.sortDirection = direction;
  }
}
