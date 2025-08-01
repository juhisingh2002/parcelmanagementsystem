import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: [
        '',
        [Validators.required, Validators.maxLength(30),
         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/)]
      ]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      alert('Login successful! Redirecting...');
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid login details');
    }
  }
}