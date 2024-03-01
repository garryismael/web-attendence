import { Component, OnInit, afterNextRender, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Attendance } from '../../models';
import { readExcel } from '../../utils';
import { AttendanceService } from './attendance.service';
import { DateFormat } from '../../utils/date';
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [ReactiveFormsModule, DateFormat],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent implements OnInit {
  attendances: Attendance[] = [];
  file: File | null = null;

  private attendanceService = inject(AttendanceService);

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.attendanceService.findAll().subscribe((attendances) => {
      this.attendances = attendances;
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
