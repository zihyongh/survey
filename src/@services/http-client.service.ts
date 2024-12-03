import { provideHttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../app/back/back-list/back-list.component';

@Injectable({
  providedIn: 'root'
})

export class HttpClientService {
  constructor(private http: HttpClient) { }

  // 讀取
  getApi<T>(url: string) {
    return this.http.get<T>(url);
  }

  // 新增
  postApi<T>(url: string, postData: any) {
    return this.http.post<T>(url, postData);
  }

  // 更新
  putApi(url: string, postData: any) {
    return this.http.put(url, postData);
  }

  // 刪除
  delApi<T>(url: string, body?: any) {
    return this.http.delete<T>(url, { body });
  }

}


