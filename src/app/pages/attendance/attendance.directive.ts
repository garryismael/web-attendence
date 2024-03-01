import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { Attendance } from "../../models";

export type SortColumnAttendance = keyof Attendance | '';
export type SortDirectionAttendance = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirectionAttendance } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface SortEventAttendance {
  column: SortColumnAttendance;
  direction: SortDirectionAttendance;
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
export class AttendanceSortableHeader {
  @Input() sortable: SortColumnAttendance = '';
  @Input() direction: SortDirectionAttendance = '';
  @Output() sort = new EventEmitter<SortEventAttendance>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
