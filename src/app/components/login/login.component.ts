import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: [
        '',
        [Validators.required, Validators.maxLength(30),
         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/)]
      ],
      userType: ['customer', Validators.required] // Default to customer
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Login Data:', formData);
      
      // Here you would typically call your authentication service
      // For now, we'll just show a success message and navigate
      alert(`Login successful as ${formData.userType}! Redirecting...`);
      
      // Navigate based on user type
      if (formData.userType === 'officer') {
        this.router.navigate(['/officer-dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      alert('Please fill in all required fields correctly.');
    }
  }
}