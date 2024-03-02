export interface AttendanceEmployeeRequestDTO {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
}

export interface AttendanceDateEmployeeRequestDTO {
  employeeId: number;
  date: string;
  present: boolean;
}

export interface Sheet {
  employees: Array<AttendanceEmployeeRequestDTO>;
  attendances: Array<AttendanceDateEmployeeRequestDTO>;
}
