import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private requestCount = 0;

  show(): void {
    this.requestCount++;
    setTimeout(() => this.loadingSubject.next(true));
  }

  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      setTimeout(() => this.loadingSubject.next(false));
    }
  }

  reset(): void {
    this.requestCount = 0;
    setTimeout(() => this.loadingSubject.next(false));
  }
}
