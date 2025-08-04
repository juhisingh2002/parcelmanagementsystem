import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule

  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registrationSuccess = false;
  generatedId = '';
  customerData: any = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/) // Only letters and spaces
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      countryCode: ['+1', Validators.required],
      mobile: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/) // Exactly 10 digits
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(10) // Minimum length for complete address
      ]],
      password: ['', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/) // At least one uppercase, lowercase, number, and special character
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.maxLength(30)
      ]],
      preferences: [''] // Optional field
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  // Custom validator to check if passwords match
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.valid) {
      try {
        // Generate unique customer ID
        this.generatedId = this.generateCustomerId();

        // Get form data
        const formData = this.registerForm.value;

        // Hash password using Web Crypto API
        const hashedPassword = await this.hashPassword(formData.password);

        // Store customer data (in real application, this would be sent to backend)
        this.customerData = {
          customerId: this.generatedId,
          name: formData.name,
          email: formData.email,
          mobile: formData.countryCode + formData.mobile,
          address: formData.address,
          password: hashedPassword, // Store hashed password
          preferences: formData.preferences || 'No preferences specified',
          registrationDate: new Date().toISOString()
        };

        console.log('Customer Registration Data:', this.customerData);
        console.log('Hashed Password:', hashedPassword);

        // Show success screen
        this.registrationSuccess = true;

      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.registerForm);
      alert('Please fill in all required fields correctly.');
    }
  }

  onReset(): void {
    this.registerForm.reset();
    this.registerForm.patchValue({
      countryCode: '+1' // Reset to default country code
    });
    this.registrationSuccess = false;
  }

  goBackToForm(): void {
    this.registrationSuccess = false;
    this.onReset();
  }

  private generateCustomerId(): string {
    // Generate unique customer ID with timestamp and random number
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CUS${timestamp}${randomNum}`;
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      // Use Web Crypto API to hash the password
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      
      // Convert hash to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return hashHex;
    } catch (error) {
      console.error('Hashing failed:', error);
      // Fallback to base64 encoding if Web Crypto API fails
      return btoa(password);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getter methods for easy access to form controls in template
  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get mobile() { return this.registerForm.get('mobile'); }
  get address() { return this.registerForm.get('address'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get preferences() { return this.registerForm.get('preferences'); }
}

