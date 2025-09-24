
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reclogin',
  templateUrl: './reclogin.component.html',
  styleUrl: './reclogin.component.css'
})



export class RecloginComponent implements OnInit {
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
  
    this._http.get<any>('http://localhost:3000/rsignup').subscribe(users => {
      const matchedUser = users.find((user: any) => 
        user.email === formValues.email && user.password === formValues.password
      );
  
      if (!matchedUser) {
        alert(' Invalid credentials, please try again');
        return;
      }
  
      alert(' Login Successful');
  
      //  Store recycler ID correctly
      localStorage.setItem('recyclerId', matchedUser.id);
      localStorage.setItem('recyclerName', matchedUser.name);

  
      this._router.navigate(['/recpage']); // Navigate to recpage
      this.loginForm.reset();
    }, (err: any) => {
      console.error(" Login Error:", err);
      alert(' Login Error');
    });
  }
  
  
  
  

  // Getter methods to access form controls
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
