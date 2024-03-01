import { Component, afterNextRender, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { Attendance } from '../../models';
import { readExcel } from '../../utils';
import { AttendanceService } from './attendance.service';
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    NzTableModule,
    NzUploadModule,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent {
  attendances: Attendance[] = [];
  file: File | null = null;

  private attendanceService = inject(AttendanceService);

  constructor() {
    afterNextRender(() => {
      this.findAll();
    });
  }

  findAll() {
    this.attendanceService.findAll().subscribe((attendances) => {
      attendances = attendances;
    });
  }

  handleChange(event: any): void {
    const file: File = event.target.files[0];

    readExcel(event.target.files);

    if (file) {
      this.file = file;
    }
  }
}
