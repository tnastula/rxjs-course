import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnersCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");

    const courses$ = http$.pipe(
      tap(value => console.log("HTTP response received")),
      retryWhen((errors) =>
        errors.pipe(
          tap(() => console.log("Error occured, will retry soon")),
          delayWhen(() => timer(2000))
        )
      ),
      map((response) => Object.values(response["payload"])),
      // Everything before shareReplay happens only once and then is just passed on
      shareReplay()
    );

    this.beginnersCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter((course: Course) => course.category == "BEGINNER")
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter((course: Course) => course.category == "ADVANCED")
      )
    );
  }
}
