

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  // Get the logged-in user ID from local storage
 getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }

  
  // Logout function
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('loggeduser');
    localStorage.removeItem('loggedmail');
  }
}
