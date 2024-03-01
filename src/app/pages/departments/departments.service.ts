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
import { Department } from '../../models';
import { handleError } from '../../utils';
import { DepartmentRequest } from './dto';
import { SortColumn, SortDirection } from './sortable.directive';
import { DecimalPipe } from '@angular/common';

interface SearchResult {
  departments: Department[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(
  departments: Department[],
  column: SortColumn,
  direction: string
): Department[] {
  if (direction === '' || column === '') {
    return departments;
  } else {
    return [...departments].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(department: Department, term: string, pipe: PipeTransform) {
  return department.name.toLowerCase().includes(term.toLowerCase());
}
@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private userUrl: string = 'departments';
  private http: HttpClient = inject(HttpClient);
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _departments$ = new BehaviorSubject<Department[]>([]);
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
        this._departments$.next(result.departments);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get departments$() {
    return this._departments$.asObservable();
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
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

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

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    return this.findAll().pipe(
      switchMap((data) => {
        // 1. sort
        let departments = sort(data, sortColumn, sortDirection);

        // 2. filter
        departments = departments.filter((department) =>
          matches(department, searchTerm, this.pipe)
        );
        const total = departments.length;

        // 3. paginate
        departments = departments.slice(
          (page - 1) * pageSize,
          (page - 1) * pageSize + pageSize
        );

        const result: SearchResult = { departments, total };
        return of(result);
      })
    );
  }
}
