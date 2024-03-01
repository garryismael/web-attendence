import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Department } from '../../../models';

@Component({
  selector: 'app-edit-department',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-department.component.html',
  styleUrl: './edit-department.component.css',
})
export class EditDepartmentComponent {
  activeModal = inject(NgbActiveModal);
  @Input()
  department!: Department;
}
