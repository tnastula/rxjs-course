import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  throttle,
  throttleTime,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, interval, forkJoin } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from "../common/debug";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: string;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
    /* this.lessons$ = this.getLessonsStream();

    forkJoin([this.course$, this.lessons$])
      .pipe(
        tap(([course, lessons]) => {
          console.log('course', course);
          console.log('lessons', lessons);
        })
      )
      .subscribe(); */
  }

  ngAfterViewInit() {
    this.streamWithStartValue();

    /* fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      debounceTime(400),
      map((event) => event.target.value),
      startWith(""),
    ).subscribe(console.log); */
  }

  streamWithStartValue(): void {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      debounceTime(400),
      map((event) => event.target.value),
      startWith(""),
      distinctUntilChanged(),
      debug(RxJsLoggingLevel.DEBUG, "search"),
      switchMap((searchTerm) => this.getLessonsStream(searchTerm))
    );
  }

  concatStreams(): void {
    const initialLessons$ = this.getLessonsStream();

    const searchLessons$ = fromEvent<any>(
      this.input.nativeElement,
      "keyup"
    ).pipe(
      debounceTime(400),
      map((event) => event.target.value),
      distinctUntilChanged(),
      switchMap((searchTerm) => this.getLessonsStream(searchTerm))
    );

    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  getLessonsStream(searchTerm: string = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${searchTerm}`
    ).pipe(map((response) => response["payload"]));
  }
}
