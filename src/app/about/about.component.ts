import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fromEvent, interval, Observable, timer } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    //this.intervalTest();
    //this.timerTest();
    //this.fromEventTest();
    this.customHttpObservable();
  }

  customHttpObservable(): void {
    const http$: Observable<any> = new Observable((observer) => {
      fetch("/api/courses")
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

    http$.subscribe({
      next: (json: any) => console.log(json),
      error: (error) => console.log(error),
      complete: () => console.log("HTTP stream completed")
    });
  }

  fromEventTest(): void {
    const click$ = fromEvent(document, "click");
    click$.subscribe((event) => console.log(event));
  }

  timerTest(): void {
    const timer$ = timer(3000, 1000);
    timer$.subscribe((val) => console.log("timer stream => " + val));
  }

  intervalTest(): void {
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
}
