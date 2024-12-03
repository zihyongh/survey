import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-front-main-page',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RouterOutlet],
  templateUrl: './front-main-page.component.html',
  styleUrl: './front-main-page.component.scss'
})
export class FrontMainPageComponent {

  constructor(private router: Router) {}

  toLogin(){
    this.router.navigateByUrl('/login');
  }


  toMain(){
    this.router.navigateByUrl('/frontMain');
  }
}
