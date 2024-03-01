import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError } from 'rxjs';
import { Employee } from '../../models';
import { handleError } from '../../utils';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private userUrl: string = 'employees';
  private http: HttpClient = inject(HttpClient);

  findAll() {
    return this.http.get<Employee[]>(this.userUrl);
  }

  findOne(id: number) {
    return this.http
      .get(`${this.userUrl}/${id}`)
      .pipe(catchError(handleError<Employee>('GetEmployee')));
  }
}
