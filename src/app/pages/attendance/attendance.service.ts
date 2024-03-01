import { HttpClient } from '@angular/common/http';
import { Injectable, afterNextRender, inject } from '@angular/core';
import { Attendance } from '../../models';
import { catchError } from 'rxjs';
import { handleError } from '../../utils';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private userUrl: string = 'attendances';
  private http: HttpClient = inject(HttpClient);

  findAll() {
    return this.http.get<Attendance[]>(this.userUrl);
  }

  findOne(id: number) {
    return this.http
      .get(`${this.userUrl}/${id}`)
      .pipe(catchError(handleError<Attendance>('GetAttendance')));
  }
}
