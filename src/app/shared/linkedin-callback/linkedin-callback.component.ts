import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-linkedin-callback',
  imports: [],
  templateUrl: './linkedin-callback.component.html',
  styleUrl: './linkedin-callback.component.scss',
})
export class LinkedinCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const name = params['name'];
      const email = params['email'];

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
