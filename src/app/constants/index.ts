import { Attendance } from '../models';

export const attendances: Attendance[] = [
  {
    id: 1,
    present: false,
    employee: {
      id: 1,
      firstName: 'Garry',
      lastName: 'Ismael',
      department: {
        id: 2,
        name: 'IT',
      },
    },
    date: {
      id: 2,
      date: '1998-12-31T16:00:00.000Z',
    },
  },
  {
    id: 2,
    present: false,
    employee: {
      id: 1,
      firstName: 'Garry',
      lastName: 'Ismael',
      department: {
        id: 2,
        name: 'IT',
      },
    },
    date: {
      id: 3,
      date: '1998-12-31T16:00:00.000Z',
    },
  },
];
