import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbHighlight,
  NgbModal,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Employee } from '../../models';
import {
  EmployeeSortableHeader,
  SortEventEmployee,
} from './employee.directive';
import { EmployeeService } from './employee.service';
import { AddEmployeeComponent } from '../../components/employees/add-employee/add-employee.component';
import { EditEmployeeComponent } from '../../components/employees/edit-employee/edit-employee.component';
import { DeleteEmployeeComponent } from '../../components/employees/delete-employee/delete-employee.component';

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
  private modalService = inject(NgbModal);
  closeResult = '';

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

  openAdd() {
    const modalRef = this.modalService.open(AddEmployeeComponent);
  }

  openEdit(employee: Employee) {
    const modalRef = this.modalService.open(EditEmployeeComponent);
    modalRef.componentInstance.employee = employee;
  }

  openDelete(employee: Employee) {
    const modalRef = this.modalService.open(DeleteEmployeeComponent);
    modalRef.componentInstance.employee = employee;
  }
}
