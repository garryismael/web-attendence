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
import { Department, Employee } from '../../models';
import { handleError } from '../../utils';
import {
  SortColumnEmployee,
  SortDirectionEmployee,
} from './employee.directive';
import { DecimalPipe } from '@angular/common';

interface SearchResult {
  employees: Employee[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumnEmployee;
  sortDirection: SortDirectionEmployee;
}

const compare = (
  v1: string | number | Department,
  v2: string | number | Department
) => {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

function sort(
  employees: Employee[],
  column: SortColumnEmployee,
  direction: string
): Employee[] {
  if (direction === '' || column === '') {
    return employees;
  } else {
    return [...employees].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(employee: Employee, term: string, pipe: PipeTransform) {
  return (
    employee.firstName.toLowerCase().includes(term.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(term.toLowerCase()) ||
    employee.department.name.toLowerCase().includes(term.toLowerCase())
  );
}
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeUrl: string = 'employees';
  private http: HttpClient = inject(HttpClient);
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _employees$ = new BehaviorSubject<Employee[]>([]);
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
        this._employees$.next(result.employees);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  findAll() {
    return this.http.get<Employee[]>(this.employeeUrl);
  }

  findOne(id: number) {
    return this.http
      .get(`${this.employeeUrl}/${id}`)
      .pipe(catchError(handleError<Employee>('GetEmployee')));
  }

  get employees$() {
    return this._employees$.asObservable();
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
  set sortColumn(sortColumn: SortColumnEmployee) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirectionEmployee) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    return this.findAll().pipe(
      switchMap((data) => {
        // 1. sort
        let employees = sort(data, sortColumn, sortDirection);

        // 2. filter
        employees = employees.filter((employee) =>
          matches(employee, searchTerm, this.pipe)
        );
        const total = employees.length;

        // 3. paginate
        employees = employees.slice(
          (page - 1) * pageSize,
          (page - 1) * pageSize + pageSize
        );

        const result: SearchResult = { employees, total };
        return of(result);
      })
    );
  }
}
