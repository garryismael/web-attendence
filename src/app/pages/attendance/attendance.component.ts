import { Component } from '@angular/core';
import { attendances } from '../../constants';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [NzTableModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent {
  attendances = attendances;
}
