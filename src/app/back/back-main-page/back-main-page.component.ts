import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-back-main-page',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RouterOutlet],
  templateUrl: './back-main-page.component.html',
  styleUrl: './back-main-page.component.scss'
})
export class BackMainPageComponent {

  constructor(private router: Router) {}

  toBackCreate(){
    this.router.navigateByUrl('/backMain/backCreate');
  }

  toMain(){
    this.router.navigateByUrl('/backMain');
  }

  logout(){
    this.router.navigateByUrl('/frontMain');
  }

}
