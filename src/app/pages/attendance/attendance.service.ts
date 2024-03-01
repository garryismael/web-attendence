import { HttpClient } from '@angular/common/http';
import { Injectable, PipeTransform, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  debounceTime,
  delay,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Attendance, AttendanceDate, Employee } from '../../models';
import { handleError } from '../../utils';
import {
  SortColumnAttendance,
  SortDirectionAttendance,
} from './attendance.directive';
import { DecimalPipe } from '@angular/common';
import {
  SortColumnEmployee,
  SortDirectionEmployee,
} from '../employee/employee.directive';

interface SearchResultAttendance {
  attendances: Attendance[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumnAttendance;
  sortDirection: SortDirectionAttendance;
}

const compare = (
  v1: string | number | boolean | AttendanceDate | Employee,
  v2: string | number | AttendanceDate | Employee | boolean
) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(
  attendances: Attendance[],
  column: SortColumnAttendance,
  direction: string
): Attendance[] {
  if (direction === '' || column === '') {
    return attendances;
  } else {
    return [...attendances].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(attendance: Attendance, term: string, pipe: PipeTransform) {
  return (
    attendance.employee.firstName.toLowerCase().includes(term.toLowerCase()) ||
    attendance.employee.lastName.toLowerCase().includes(term.toLowerCase()) ||
    attendance.employee.department.name
      .toLowerCase()
      .includes(term.toLowerCase()) ||
    attendance.date.date.toLowerCase().includes(term.toLowerCase())
  );
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private userUrl: string = 'attendances';
  private http: HttpClient = inject(HttpClient);
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _attendances$ = new BehaviorSubject<Attendance[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private pipe: DecimalPipe = inject(DecimalPipe);
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor() {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._attendances$.next(result.attendances);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get attendances$() {
    return this._attendances$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumnAttendance) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirectionEmployee) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResultAttendance> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    return this.findAll().pipe(
      switchMap((data) => {
        // 1. sort
        let attendances = sort(data, sortColumn, sortDirection);

        // 2. filter
        attendances = attendances.filter((department) =>
          matches(department, searchTerm, this.pipe)
        );
        const total = attendances.length;

        // 3. paginate
        attendances = attendances.slice(
          (page - 1) * pageSize,
          (page - 1) * pageSize + pageSize
        );

        const result: SearchResultAttendance = { attendances, total };
        return of(result);
      })
    );
  }

  findAll() {
    return this.http.get<Attendance[]>(this.userUrl);
  }

  findOne(id: number) {
    return this.http
      .get(`${this.userUrl}/${id}`)
      .pipe(catchError(handleError<Attendance>('GetAttendance')));
  }
}
