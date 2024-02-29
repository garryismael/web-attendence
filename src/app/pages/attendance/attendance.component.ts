import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { attendances } from '../../constants';
import { ReactiveFormsModule } from '@angular/forms';
import { readExcel } from '../../utils';
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    NzTableModule,
    NzUploadModule,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent {
  attendances = attendances;
  file: File | null = null;

  constructor(private msg: NzMessageService) {}

  handleChange(event: any): void {
    const file: File = event.target.files[0];

    readExcel(event.target.files);

    if (file) {
      this.file = file;
    }
  }
}
