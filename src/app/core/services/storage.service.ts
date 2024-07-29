import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';

  setItem(key: string, value: any) {
    if (this.isLocalStorageAvailable) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  
  getItem(key: string) {
    if (this.isLocalStorageAvailable) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  removeItem(key: string) {
    if (this.isLocalStorageAvailable) {
      localStorage.removeItem(key);
    }
  }

  clear() {
    if (this.isLocalStorageAvailable) {
      localStorage.clear();
    }
  }
}
