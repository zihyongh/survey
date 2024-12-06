import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {
    isAdmin = false;

    // 靜態的管理者帳號和密碼
  private adminCredentials = {
    account: 'admin', // 管理者帳號
    password: '123456' // 管理者密碼
  };

  constructor() { }

  // 驗證帳號和密碼
  validateAdmin(account: string, password: string): boolean {
    return account === this.adminCredentials.account && password === this.adminCredentials.password;
  }



}
