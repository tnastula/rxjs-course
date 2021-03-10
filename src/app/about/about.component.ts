import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fromEvent, interval, timer } from "rxjs";

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

    const observer = {
      next: (val: number) => console.log("interval stream => " + val),
      error: err => console.log(err),
      complete: () => console.log('interval stream => COMPLETED'),
    };
    
    // Stream ends with error or completion. Stream won't emit more after even single error.
    const subscription = interval$.subscribe(observer);

    setTimeout(() => subscription.unsubscribe(), 5000);
  }
}
