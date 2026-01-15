import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-reclogin',
  templateUrl: './reclogin.component.html',
  styleUrls: ['./reclogin.component.css']
})
export class RecloginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
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

        // 🔴 Clear previous data
        localStorage.clear();

        // ✅ Store standardized keys
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('role', res.role); // recycler | generator
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);
        localStorage.setItem('contact', res.contact ?? '');

        alert('Login successful');

        if (res.role === 'recycler') {
          this.router.navigate(['/recpage']);
        } else {
          alert('Not a recycler account');
          localStorage.clear();
        }
      },
      error: () => {
        alert('Invalid email or password');
      }
    });
  }

  // Getters
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
