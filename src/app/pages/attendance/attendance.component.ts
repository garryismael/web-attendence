import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { Attendance } from '../../models';
import { DateFormat } from '../../utils/date';
import {
  AttendanceSortableHeader,
  SortEventAttendance,
} from './attendance.directive';
import { AttendanceService } from './attendance.service';
import { Sheet } from './sheet';
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
  data: Sheet = {
    attendances: [],
    employees: [],
  };

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

  async handleChange(event: any): Promise<void> {
    const file: File = event.target.files[0];

    await this.readExcel(event.target.files);

    if (file) {
      this.file = file;
    }
  }

  async readExcel(fileList: FileList) {
    if (fileList && fileList?.length > 0) {
      let file = fileList[0];
      let reader = new FileReader();
      let excelData: any = {};
      reader.onload = (e: any) => {
        let workbook = XLSX.read(e.target.result, {
          type: 'array',
          cellDates: true,
        });
        let sheetNames = Object.keys(workbook.Sheets);
        for (const sheetName of sheetNames) {
          const sheetData: any = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName]
          );
          for (const row of sheetData) {
            for (const key in row) {
              if (row[key] instanceof Date) {
                row[key] = moment(row[key], 'MM/DD/YYYY h:mm A').format(
                  'MM/DD/YYYY HH:mm'
                );
              }
            }
          }
          excelData[sheetName] = sheetData;
        }
        this.cleanData(excelData);
        console.log(this.data);
      };
      reader.readAsArrayBuffer(file);
    }
    return [];
  }

  onSort({ column, direction }: SortEventAttendance) {
    this.headers?.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.attendanceService.sortColumn = column;
    this.attendanceService.sortDirection = direction;
  }

  cleanData(data: any) {
    let sheet: Sheet = {
      attendances: [],
      employees: [],
    };
    for (const [key, value] of Object.entries(data)) {
      if (key.toLowerCase() === 'attendance') {
        const arrayValue = value as Array<any>;
        for (const item of arrayValue) {
          sheet.attendances.push({
            employeeId: item.EmployeeId as number,
            date: item.Date as string,
            present: item.Present.toLowerCase() === 'yes' ? true : false,
          });
        }
      } else if (key.toLowerCase() === 'employee') {
        const arrayValue = value as Array<any>;
        for (const item of arrayValue) {
          sheet.employees.push({
            id: item.ID,
            department: item.Department,
            firstName: item.Firstname,
            lastName: item.Lastname,
          });
        }
      }
    }
    this.data = sheet;
  }
}
