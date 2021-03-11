import { concat, fromEvent, interval, of, timer } from "rxjs";
import { map } from "rxjs/operators";

export function runTests() {
  //intervalTest();
  //timerTest();
  //fromEventTest();
  //httpObservable();
  //mapOperator();
  this.concatenateTwoStreams();
}

function concatenateTwoStreams(): void {
  const source1$ = of(1, 2, 3);
  const source2$ = of(4, 5, 6);
  const source3$ = of(7, 8, 9);
  const result$ = concat(source1$, source2$, source3$);

  result$.subscribe({
    next: (value: number) => console.log(value),
    error: (error) => console.log(error),
    complete: () => console.log("Numbers stream is finished"),
  });
}

function mapOperator(): void {
  const courses$ = this.http$.pipe(
    map((response) => Object.values(response["payload"]))
  );

  courses$.subscribe({
    next: (courses: any) => console.log(courses),
    error: (error) => console.log(error),
    complete: () => console.log("HTTP stream completed"),
  });
}

function httpObservable(): void {
  this.http$.subscribe({
    next: (json: any) => console.log(json),
    error: (error) => console.log(error),
    complete: () => console.log("HTTP stream completed"),
  });
}

function fromEventTest(): void {
  const click$ = fromEvent(document, "click");
  click$.subscribe((event) => console.log(event));
}

function timerTest(): void {
  const timer$ = timer(3000, 1000);
  timer$.subscribe((val) => console.log("timer stream => " + val));
}

function intervalTest(): void {
  // Definition of stream (observable). Nothing is emitted until it is subscribed to.
  const interval$ = interval(1000);

  // Stream ends with error or completion. Stream won't emit more after even single error.
  const subscription = interval$.subscribe({
    next: (val: number) => console.log("interval stream => " + val),
    error: (err) => console.log(err),
    complete: () => console.log("interval stream => COMPLETED"),
  });

  setTimeout(() => subscription.unsubscribe(), 5000);
}
