import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule], // ✅ Add RouterModule for routerLink to work
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  title = 'Parcel Management System';

  onBookNow() {
    console.log('Book Now clicked!');
    alert('Booking feature will be implemented next!');
  }

  onServiceClick(service: string) {
    console.log(`${service} service selected`);
    alert(`${service} feature coming soon!`);
  }

  onGetEstimate() {
    console.log('Get Estimate clicked!');
    alert('Estimate calculator coming soon!');
  }

  onSocialClick(platform: string) {
    console.log(`${platform} social link clicked`);
  }
}