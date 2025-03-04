import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-contact-us',
  imports: [FooterComponent, NavbarComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent implements OnInit {
  userId: string = localStorage.getItem('userId')!;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.getUserData();
  }
  getUserData() {
    this.authService.getUserDataByUserId(this.userId).subscribe({
      next: (res: any) => {
        // console.log(res.data);
        this.firstName = res.data.firstName;
        this.lastName = res.data.lastName;
        this.email = res.data.user.email;
        this.phone = res.data.phone;
        // console.log(this.email);
      },
    });
  }
}
