import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-genlogin',
  templateUrl: './genlogin.component.html',
  styleUrl: './genlogin.component.css'
})


export class GenloginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private formbuilder: FormBuilder, private _router: Router, private _http: HttpClient) { }

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],  // Add validators to email field
      password: ['', [Validators.required, Validators.minLength(6)]]  // Add validators to password field
    });
  }

  logIn(): void {
    const formValues = this.loginForm.value;
  
    this._http.get<any>('http://localhost:3000/gsignup').subscribe(users => {
      // Find user with matching email and password
      const matchedUser = users.find((user: any) => 
        user.email === formValues.email && user.password === formValues.password
      );
  
      if (!matchedUser) {
        alert('Invalid credentials, please try again');
        return;
      }
  
      alert('Login Successful');
  
      // Store userId in localStorage
      localStorage.setItem('userId', matchedUser.id);
      localStorage.setItem('loggeduser', matchedUser.name || 'Guest');
      localStorage.setItem('loggedmail', matchedUser.email || 'Guest');
      localStorage.setItem('loggedcont', matchedUser.mobile || 'Guest');
      
      
  
      this._router.navigate(['/genprofile']); // Navigate to the restaurant dashboard
      this.loginForm.reset();
    }, (err: any) => {
      console.log(err);
      alert('Login Error');
    });
  }
  
  logout() {
    localStorage.removeItem('loggeduser'); 
    window.location.href = '/genlogin';
  }
  
  

  // Getter methods to access form controls
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
