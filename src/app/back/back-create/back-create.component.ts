import { DateService } from '../../../@services/date-service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { BackService } from '../../../@services/back-service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { provideHttpClientService } from '../../http-service/http-client.service';
import { HttpClientService } from '../../../@services/http-client.service';


@Component({
  selector: 'app-back-create',
  standalone: true,
  imports: [MatButtonModule, MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatCheckboxModule, CommonModule,
    MatIconModule, MatSnackBarModule],
  templateUrl: './back-create.component.html',
  styleUrl: './back-create.component.scss'
})



export class BackCreateComponent {

  @ViewChild('stepper') private stepper!: MatStepper;

  constructor(private dateService: DateService,
    private backService: BackService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClientService
  ) {}


  // 必填設定
  basicFormGroup1 = new FormGroup({
    title: new FormControl('', Validators.required),       // 設置名稱欄必填
    description: new FormControl('', Validators.required),   // 設置說明欄必填
    startDate: new FormControl('', Validators.required),  // 設置日期選擇器欄位為必填
    endDate: new FormControl('', Validators.required)     // 另一個日期選擇器欄位為必填
  });

  basicFormGroup2 = new FormGroup({
    questionTitle: new FormControl('', Validators.required),
    questionType: new FormControl('', Validators.required),
    required: new FormControl(false),

  });




  // 下面是問題內容加入
  // 初始化一個陣列來存儲已加入的問題
  questionData: any[] = [];           // 每一題是一個物件，確認題目數量之後把題目們(物件)放進大陣列裡
  questionId: number = 1;             // 自動生成Id
  options: { optionNumber: number; option: string }[] = [];    // 選項的物件陣列

  // 下面是接收編輯模式時，正在編輯的問題的index
  editIndex: number | null = null;    // 用來儲存正在編輯項目的index

  trackByFn(index: number, item: any): any {
    return item.id || index; // 唯一標識符
  }

  // 動態新增選項
  addOption(): void {
    const newOptionNumber = this.options.length + 1
    this.options.push({ optionNumber: newOptionNumber, option: '' });
  }

  // 動態刪除選項
  removeOption(index: number): void {
    this.options.splice(index, 1); // 刪除指定索引的選項
    this.updateOptionNumbers(); // 刪除後更新 optionNumber
  }

  // 更新 optionNumber
  updateOptionNumbers(): void {
    this.options.forEach((option, index) => {
      option.optionNumber = index + 1
    });
  }


  updateOptionValue(index: number, event: Event) {
    const inputElement = event.target as HTMLInputElement; // 顯式轉型為 HTMLInputElement
    if (inputElement && inputElement.value !== undefined) {
      this.options[index].option = inputElement.value; // 更新指定索引的選項值
    }
  }

  // 清空選項
  clearOptions() {
    this.options = [];
  }

  // 題目類型改變時清空選項
  onQuestionTypeChange() {
    if (this.basicFormGroup2.value.questionType === 'text') {
      this.clearOptions();
    }
  }

  updateQuestionContent(index: number) {
    if (this.editIndex !== null) {
      // 如果正在編輯模式，更新對應問題的選項
      this.questionData[this.editIndex].questionContent = [...this.options];
    }
  }




  // 問題新增
  saveAndNext2() {
    if (this.basicFormGroup2.valid) {
      const questionType = this.basicFormGroup2.value.questionType;

      // 驗證選項數量
      if ((questionType == 'single' || questionType == 'multi') && this.options.length < 2 ) {
        this.snackBar.open('選項數量不得少於兩個！', '關閉', { duration: 3000 });
        return;
      }
      // 驗證問題不能為空
      if ((questionType == 'single' || questionType == 'multi') ) {
        for(let op of this.options){
          if(op.option.length == 0){
            this.snackBar.open('選項內容不能為空！', '關閉', { duration: 3000 });
            return;
          }
        }

      }

      // 更新選項編號以確保連續
      this.updateOptionNumbers();

      // 建立問題物件
      const question = {
        questionId: this.editIndex !== null ? this.questionData[this.editIndex].questionId : this.questionId++, // 如果在編輯模式，保持原 ID
        questionTitle: this.basicFormGroup2.value.questionTitle,
        questionType: questionType,
        required: this.basicFormGroup2.value.required,
        questionContent: questionType === 'text' ? [] : [...this.options], // 填充題不需要選項
      };


      if (this.editIndex !== null) {
        // 如果在編輯模式，更新現有的問題
        this.questionData[this.editIndex] = question;
        this.snackBar.open('問題已更新', '關閉', { duration: 3000 });
        this.editIndex = null; // 清除編輯模式
      } else {
        // 如果不是編輯模式，新增問題
        this.questionData.push(question);
        this.snackBar.open('問題已新增', '關閉', { duration: 3000 });
      }

      this.basicFormGroup2.reset();
      this.clearOptions();
      console.log(this.questionData); // 檢查輸出的問題資料
    }

  }



  // 日期

  endDate!: string
  startMinDate!: string;
  endMinDate!: string;


  // 日期轉換
  ngOnInit(): void {

    // 設定選取日期最小值為當天
    this.startMinDate = this.dateService.changeDateFormat(this.dateService.addDate(new Date(), 2));
    // 設定選取日期最小值為當天+天
    this.endMinDate = this.dateService.changeDateFormat(this.dateService.addDate(new Date(), 7));

    console.log('當前預覽問卷:', this.survey);

  }



  // 接資料的總物件
  survey: any = {};


  // 新增完成先存入service，以便之後預覽
  preparePreview(): void {
    this.updateOptionNumbers(); // 確保選項編號正確
    this.survey = {
      ...this.basicFormGroup1.value,              // 問卷標題與說明
      questionData: this.questionData,            // 問題數據
    };
    console.log(this.survey);                                 // 確認資料是否成功添加
    this.backService.BackAnswer = this.survey;                // 存入service
  }


  finalizeSurvey(): void {
    // 整理資料
    const tidyData = {
      title: this.backService.BackAnswer.title,
      description: this.backService.BackAnswer.description,
      startDate: this.backService.BackAnswer.startDate,
      endDate: this.backService.BackAnswer.endDate,
      published: false, // 假設預設為 false
      quesList: this.backService.BackAnswer.questionData.map((question: any) => ({
        questionId: question.questionId,
        questionTitle: question.questionTitle,
        questionType: question.questionType,
        required: question.required,
        questionContent: JSON.stringify(question.questionContent), // 將選項轉為 JSON 字符串
      })),
    };

    console.log('準備送出的資料:', tidyData);

    // 發送整理好的資料到 API
    this.http.postApi('http://localhost:8080/quiz/create', tidyData)
    .subscribe({
      next: (res) => {
        console.log('成功儲存:', res);
        alert('問卷已成功儲存！'); // 顯示成功提示
        this.router.navigateByUrl('/backMain'); // 成功後跳轉頁面
      },
      error: (error) => {
        console.error('儲存過程中出現錯誤:', error);
        alert('儲存失敗，請稍後再試！'); // 顯示錯誤提示
      }
    });

  }




  // 刪除問題
  selectedIndexes: number[] = [];

  onCheckboxChange(event: any, index: number): void {
    if (event.checked) {
      // 當勾選時，將該索引加入選取清單
      this.selectedIndexes.push(index);
    } else {
      // 當取消勾選時，從選取清單移除該索引
      this.selectedIndexes = this.selectedIndexes.filter(i => i !== index);
    }
  }

  deleteSelectedQuestions(): void {
    // 根據選取的索引，從 questionData 中刪除
    this.selectedIndexes.sort((a, b) => b - a); // 倒序排列，避免索引變動錯誤
    this.selectedIndexes.forEach(index => {
      this.questionData.splice(index, 1);
    });

    // 清空選取清單
    this.selectedIndexes = [];
    this.preparePreview(); // 更新儲存的資料
  }



  // 編輯資料
  // 編輯指定的題目，將資料帶入表單
  editQuestion(index: number): void {
    const questionToEdit = this.questionData[index];
    this.basicFormGroup2.patchValue({
      questionTitle: questionToEdit.questionTitle,
      questionType: questionToEdit.questionType,
      required: questionToEdit.required,
    });

    this.options = [...questionToEdit.questionContent];
    this.editIndex = index;
  }

  // 確認頁測試
  test() {
    console.log(this.backService.BackAnswer)
  }

  // 回首頁
  toMain(){
    this.router.navigateByUrl('/backMain');
  }






}
