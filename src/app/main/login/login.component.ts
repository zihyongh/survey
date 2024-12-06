import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../../@services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatIcon , CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  showPassword = false;
  errorMessage = ''; // 用於顯示錯誤訊息

  constructor(private router: Router, private userService: UserService) { }

  loginGroup: FormGroup = new FormGroup({
    account: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  changePasswordIcon() {
    this.showPassword = !this.showPassword;
  }

  login() {
    const account = this.loginGroup.value.account;
    const password = this.loginGroup.value.password;

    if (this.userService.validateAdmin(account, password)) {
      this.userService.isAdmin = true; // 驗證成功，設置為管理員
      this.router.navigate(['/backMain/backList']); // 跳轉到後台
    } else {
      this.errorMessage = '帳號或密碼錯誤'; // 顯示錯誤訊息
    }
  }
}
