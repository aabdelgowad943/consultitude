import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private pendingPurchaseSubject = new BehaviorSubject<string | null>(null);
  pendingPurchase$ = this.pendingPurchaseSubject.asObservable();

  setPendingPurchase(id: string) {
    this.pendingPurchaseSubject.next(id);
  }

  clearPendingPurchase() {
    this.pendingPurchaseSubject.next(null);
  }
}
