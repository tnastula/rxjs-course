import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import { filter, map, tap } from "rxjs/operators";
import { Course } from "../model/course";
import { createHttpObservable } from "./util";

@Injectable({
  providedIn: "root",
})
export class Store {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  init(): void {
    const http$ = createHttpObservable("/api/courses");

    http$
      .pipe(
        tap(() => console.log("HTTP request executed")),
        map((res) => Object.values(res["payload"]))
      )
      .subscribe({
        next: (courses: Course[]) => this.subject.next(courses),
        error: (error) => this.subject.error(error),
        complete: () => this.subject.complete,
      });
  }

  selectBeginnerCourses(): Observable<Course[]> {
    return this.filterByCategory("BEGINNER");
  }

  selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory("ADVANCED");
  }

  selectCourseById(courseId: number): Observable<Course> {
    return this.courses$.pipe(
      map((courses) => courses.find((course) => course.id == courseId)),
      filter(course => !!course)
    );
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map((courses) => courses.filter((course) => course.category == category))
    );
  }

  saveCourseFromTutorial(courseId: number, changes: any): Observable<any> {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex((course) => course.id == courseId);

    const newCourses = courses.slice(0);
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes,
    };

    this.subject.next(newCourses);

    return fromPromise(
      fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }

  saveCourse(courseId: number, changes: any): Observable<any> {
    return new Observable<any>((observer) => {
      const controller = new AbortController();
      const signal = controller.signal;

      fetch(`/api/courses/${courseId}`, {
        signal: signal,
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            observer.error(
              "Request failed with status code: " + response.status
            );
          }
        })
        .then((responseBody) => {
          const courses = this.subject.getValue();
          const courseIndex = courses.findIndex(
            (course) => course.id == courseId
          );

          const newCourses = courses.slice(0);
          newCourses[courseIndex] = {
            ...courses[courseIndex],
            ...changes,
          };

          this.subject.next(newCourses);

          observer.next(responseBody);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });

      return () => controller.abort();
    });
  }
}
