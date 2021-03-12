import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

let rxjsLoggingLevel = RxJsLoggingLevel.INFO;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxjsLoggingLevel = level;
}

// This is a custom operator. Used in course.component.ts
export const debug = (level: RxJsLoggingLevel, message: string) => (
  source: Observable<any>
) =>
  source.pipe(
    tap((val) => {
      if (level < rxjsLoggingLevel) {
        return;
      }

      console.log(message + ": " + val);
    })
  );
