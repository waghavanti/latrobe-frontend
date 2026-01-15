import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-genlogin',
  templateUrl: './genlogin.component.html',
  styleUrls: ['./genlogin.component.css']
})
export class GenloginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  logIn() {
    if (this.loginForm.invalid) return;

    this.http.post<any>(
      `${environment.apiUrl}/api/users/login`,
      this.loginForm.value
    ).subscribe({
      next: (res) => {

        // 🔴 Clear old data
        localStorage.clear();

        // ✅ Store standardized keys
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('role', res.role); // generator | recycler
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);
        localStorage.setItem('contact', res.contact ?? '');

        alert('Login successful');

        // ✅ Redirect based on role
        if (res.role === 'generator') {
          this.router.navigate(['/genprofile']);
        } else if (res.role === 'recycler') {
          this.router.navigate(['/recpage']);
        } else {
          alert('Invalid role');
        }
      },
      error: () => {
        alert('Invalid email or password');
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
