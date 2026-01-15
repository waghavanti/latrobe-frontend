import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-gensignup',
  templateUrl: './gensignup.component.html',
  styleUrls: ['./gensignup.component.css']
})
export class GensignupComponent implements OnInit {

  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['generator']   // ✅ fixed role
    });
  }

  signUp() {
    if (this.signupForm.invalid) return;

    this.http.post(
      `${environment.apiUrl}/api/users/register`,
      this.signupForm.value
    ).subscribe({
      next: () => {
        alert('Generator registered successfully');
        this.signupForm.reset();
        this.router.navigate(['/genlogin']);
      },
      error: (err) => {
        alert(err.error?.message || 'Signup failed');
      }
    });
  }
}
