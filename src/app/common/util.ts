import { Observable } from "rxjs";

export function createHttpObservable(url: string): Observable<any> {
  return new Observable((observer) => {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        observer.next(json);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
}
