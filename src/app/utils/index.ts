import * as XLSX from 'xlsx';
import moment from 'moment';

export const getFilename = (fileList?: FileList | null | undefined): string => {
  return fileList && fileList?.length > 0 ? fileList[0].name : '';
};

export const readExcel = async (fileList: FileList) => {
  if (fileList && fileList?.length > 0) {
    let file = fileList[0];
    let reader = new FileReader();
    reader.onload = function (e: any) {
      let workbook = XLSX.read(e.target.result, {
        type: 'array',
        cellDates: true,
      });
      let sheetNames = Object.keys(workbook.Sheets);
      for (const sheetName of sheetNames) {
        const sheetData: any = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName]
        );
        for (const row of sheetData) {
          for (const key in row) {
            if (row[key] instanceof Date) {
              row[key] = moment(row[key]).format('MM/DD/YYYY HH:mm');
            }
          }
        }
        console.log(sheetData);
      }
    };
    reader.readAsArrayBuffer(file);
  }
  return [];
};
