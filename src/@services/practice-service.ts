import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Practice {

  private practiceData = {
    vipName : '小明',
    vipId: '12345',
    vipAge: '12',
    vipGender: 'm',
    vipCart: [
      { buy: 'laptop' , pay: 30000 , color: 'blue' , count: 1},       // 因為pay和count可能需要做計算，所以用number不用string
      { buy: 'mouse' , pay: 20 , color: 'black' , count: 1},
      { buy: 'keyBoard' , pay: 50 , color: 'red' , count: 1},
      { buy: 'bag' , pay: 500 , color: 'black' , count: 1}
    ]
  }
}
