import { Observable, TeardownLogic } from "rxjs";

export function createHttpObservable(url: string): Observable<any> {
  return new Observable((observer) => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        observer.next(json);
        observer.complete();
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        }
        observer.error(error);
      });

    return () => controller.abort();
  });
}
