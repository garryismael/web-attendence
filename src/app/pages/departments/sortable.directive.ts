import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Department } from '../../models';

export type SortColumnDepartment = keyof Department | '';
export type SortDirectionDepartment = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirectionDepartment } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface SortEventDepartment {
  column: SortColumnDepartment;
  direction: SortDirectionDepartment;
}

@Directive({
  selector: 'th[sortable]',
  standalone: true,
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class DepartmentSortableHeader {
  @Input() sortable: SortColumnDepartment = '';
  @Input() direction: SortDirectionDepartment = '';
  @Output() sort = new EventEmitter<SortEventDepartment>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
