export interface Department {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  department: Department;
}

export interface AttendanceDate {
  id: number;
  date: string;
}

export interface Attendance {
  id: number;
  present: boolean;
  employee: Employee;
  date: AttendanceDate;
}
