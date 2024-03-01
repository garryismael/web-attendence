import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Department } from '../../../models';

@Component({
  selector: 'app-delete-department',
  standalone: true,
  imports: [],
  templateUrl: './delete-department.component.html',
  styleUrl: './delete-department.component.css',
})
export class DeleteDepartmentComponent {
  activeModal = inject(NgbActiveModal);
  @Input()
  department!: Department;
}
