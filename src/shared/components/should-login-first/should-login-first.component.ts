import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-should-login-first',
  imports: [RouterModule],
  templateUrl: './should-login-first.component.html',
  styleUrl: './should-login-first.component.scss',
})
export class ShouldLoginFirstComponent {
  constructor(private router: Router, public dialogRef: DynamicDialogRef) {}

  goToLogin() {
    this.router.navigate(['/auth/login']);
    this.dialogRef.close();
  }
}
