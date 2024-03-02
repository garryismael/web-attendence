import { Observable, of } from 'rxjs';

export const getFilename = (fileList?: FileList | null | undefined): string => {
  return fileList && fileList?.length > 0 ? fileList[0].name : '';
};

export function log(message: string) {
  console.error(message);
}

export function handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
