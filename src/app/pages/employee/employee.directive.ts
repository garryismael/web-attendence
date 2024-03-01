import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models';

export type SortColumnEmployee = keyof Employee | '';
export type SortDirectionEmployee = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirectionEmployee } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface SortEventEmployee {
  column: SortColumnEmployee;
  direction: SortDirectionEmployee;
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
export class EmployeeSortableHeader {
  @Input() sortable: SortColumnEmployee = '';
  @Input() direction: SortDirectionEmployee = '';
  @Output() sort = new EventEmitter<SortEventEmployee>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
