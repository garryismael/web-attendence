import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { attendances } from '../../constants';
import { ReactiveFormsModule } from '@angular/forms';
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

  constructor(private msg: NzMessageService) {}

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }
}
