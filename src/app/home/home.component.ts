import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { Store } from "../common/store.service";
import { createHttpObservable } from "../common/util";
import { Observable, timer } from "rxjs";
import { delayWhen, map, retryWhen, shareReplay, tap } from "rxjs/operators";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.beginnerCourses$ = this.store.selectBeginnerCourses();
    this.advancedCourses$ = this.store.selectAdvancedCourses();
  }

  // Unused, left as an example
  private getCoursesStream(): Observable<Course[]> {
    const http$ = createHttpObservable("/api/courses");

    return http$.pipe(
      tap(() => console.log("HTTP request executed")),
      map((res) => Object.values(res["payload"])),
      shareReplay(),
      retryWhen((errors) => errors.pipe(delayWhen(() => timer(2000))))
    );
  }
}
