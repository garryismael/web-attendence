import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DepartmentRequest } from './dto';
import { Department } from '../../models';
import { catchError } from 'rxjs';
import { handleError } from '../../utils';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  private userUrl: string = 'departments';
  private http: HttpClient = inject(HttpClient);

  findAll() {
    return this.http.get<Department[]>(this.userUrl);
  }

  findOne(id: number) {
    return this.http
      .get(`${this.userUrl}/${id}`)
      .pipe(catchError(handleError<Department>('GetDepartment')));
  }

  addDepartment(request: DepartmentRequest) {
    return this.http
      .post<Department>(this.userUrl, request)
      .pipe(catchError(handleError<Department>('createDepartment')));
  }
}
