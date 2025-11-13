import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-genlogin',
  templateUrl: './genlogin.component.html',
  styleUrls: ['./genlogin.component.css']
})
export class GenloginComponent implements OnInit {
  loginForm!: FormGroup;

  // Use your Render backend URL here
  private apiUrl = 'https://jsonserverr-green2.onrender.com';

  constructor(
    private formbuilder: FormBuilder, 
    private _router: Router, 
    private _http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],  // Email validation
      password: ['', [Validators.required, Validators.minLength(6)]]  // Password validation
    });
  }

  logIn(): void {
    const formValues = this.loginForm.value;

    // Fetch users from live backend
    this._http.get<any>(`${this.apiUrl}/gsignup`).subscribe(users => {
      const matchedUser = users.find((user: any) => 
        user.email === formValues.email && user.password === formValues.password
      );

      if (!matchedUser) {
        alert('Invalid credentials, please try again');
        return;
      }

      alert('Login Successful');

      // Store user data in localStorage
      localStorage.setItem('userId', matchedUser.id);
      localStorage.setItem('loggeduser', matchedUser.name || 'Guest');
      localStorage.setItem('loggedmail', matchedUser.email || 'Guest');
      localStorage.setItem('loggedcont', matchedUser.mobile || 'Guest');

      this._router.navigate(['/genprofile']); // Navigate to profile/dashboard
      this.loginForm.reset();
    }, (err: any) => {
      console.error(err);
      alert('Login Error');
    });
  }

  logout() {
    localStorage.removeItem('loggeduser');
    localStorage.removeItem('userId');
    localStorage.removeItem('loggedmail');
    localStorage.removeItem('loggedcont');
    window.location.href = '/genlogin';
  }

  // Getter methods for easy form access
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
