import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Attendance } from '../../models';
import { readExcel } from '../../utils';
import { DateFormat } from '../../utils/date';
import {
  AttendanceSortableHeader,
  SortEventAttendance,
} from './attendance.directive';
import { AttendanceService } from './attendance.service';
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    AttendanceSortableHeader,
    NgbPaginationModule,
    DateFormat,
  ],
  providers: [AttendanceService, DecimalPipe],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent implements OnInit {
  attendances: Attendance[] = [];
  attendances$: Observable<Attendance[]>;
  total$: Observable<number>;
  @ViewChildren(AttendanceSortableHeader)
  headers?: QueryList<AttendanceSortableHeader>;
  file: File | null = null;

  constructor(public attendanceService: AttendanceService) {
    this.attendances$ = attendanceService.attendances$;
    this.total$ = attendanceService.total$;
  }

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

  onSort({ column, direction }: SortEventAttendance) {
    // resetting other headers
    this.headers?.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.attendanceService.sortColumn = column;
    this.attendanceService.sortDirection = direction;
  }
}
