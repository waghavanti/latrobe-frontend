import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recsignup',
  templateUrl: './recsignup.component.html',
  styleUrls: ['./recsignup.component.css']
})
export class RecsignupComponent implements OnInit {

  signupForm!: FormGroup;
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private formbuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formbuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['recycler']   // ✅ THIS IS THE KEY
    });
  }

  signUp() {
    if (this.signupForm.invalid) {
      alert('Please fill all fields correctly');
      return;
    }

    this.http.post(`${this.apiUrl}/users/register`, this.signupForm.value)
      .subscribe({
        next: () => {
          alert('Recycler Signup Successful');
          this.signupForm.reset();
          this.router.navigate(['/reclogin']);
        },
        error: (err) => {
          alert(err.error?.message || 'Signup failed');
        }
      });
  }

  // getters (for validation messages – KEEP UI SAME)
  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get mobile() { return this.signupForm.get('mobile'); }
  get password() { return this.signupForm.get('password'); }
}
