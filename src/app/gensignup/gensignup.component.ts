import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  
import { Router } from '@angular/router';

@Component({
  selector: 'app-gensignup',
  templateUrl: './gensignup.component.html',
  styleUrl: './gensignup.component.css'
})


export class GensignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private formbuilder: FormBuilder, private _http: HttpClient, private _router: Router) { }

  ngOnInit(): void {
    this.signupForm = this.formbuilder.group({
      name: ['', Validators.required],  // Name field is required
      email: ['', [Validators.required, Validators.email]],  // Email must be valid
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],  // Mobile must be numeric and 10 digits
      password: ['', [Validators.required, Validators.minLength(6)]]  // Password must be at least 6 characters
    });
  }

  signUp() {
    if (this.signupForm.valid) {
      this._http.post<any>('http://localhost:3000/gsignup', this.signupForm.value).subscribe(res => {
        console.log(res);
        alert('Signup Successful');
        
        // Store user data in localStorage after successful signup
        localStorage.setItem('user', JSON.stringify(this.signupForm.value));
        

        this.signupForm.reset();
        this._router.navigate(['/genlogin']);
      }, (err: any) => {
        console.log(err);
        alert('Signup Error');
      });
    } else {
      alert('Please fill out all fields correctly');
    }
  }

  // Getter methods for easy access to form controls in the HTML template
  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get mobile() {
    return this.signupForm.get('mobile');
  }

  get password() {
    return this.signupForm.get('password');
  }
}
