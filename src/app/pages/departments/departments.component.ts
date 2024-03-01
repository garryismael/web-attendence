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
import { AddDepartmentComponent } from '../../components/departments/add-department/add-department.component';
import { DeleteDepartmentComponent } from '../../components/departments/delete-department/delete-department.component';
import { EditDepartmentComponent } from '../../components/departments/edit-department/edit-department.component';
import { Department } from '../../models';
import { DepartmentService } from './departments.service';
import {
  DepartmentSortableHeader,
  SortEventDepartment,
} from './sortable.directive';

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
  @ViewChildren(DepartmentSortableHeader)
  headers?: QueryList<DepartmentSortableHeader>;
  private modalService = inject(NgbModal);
  closeResult = '';

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

  onSort({ column, direction }: SortEventDepartment) {
    // resetting other headers
    this.headers?.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.departmentService.sortColumn = column;
    this.departmentService.sortDirection = direction;
  }

  openAdd() {
    const modalRef = this.modalService.open(AddDepartmentComponent);
  }

  openEdit(department: Department) {
    const modalRef = this.modalService.open(EditDepartmentComponent);
    modalRef.componentInstance.department = department;
  }

  openDelete(department: Department) {
    const modalRef = this.modalService.open(DeleteDepartmentComponent);
    modalRef.componentInstance.department = department;
  }
}
