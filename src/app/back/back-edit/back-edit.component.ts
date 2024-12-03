import { EditService } from './../../../@services/edit-service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { DateService } from '../../../@services/date-service';
import { BackService } from '../../../@services/back-service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientService } from '../../../@services/http-client.service';

@Component({
  selector: 'app-back-edit',
  standalone: true,
  imports: [MatButtonModule, MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatCheckboxModule, CommonModule,
    MatIconModule, MatSnackBarModule],
  templateUrl: './back-edit.component.html',
  styleUrl: './back-edit.component.scss'
})

export class BackEditComponent {
  @ViewChild('stepper') private stepper!: MatStepper;

  constructor(
    private dateService: DateService,
    private backService: BackService,
    private router: Router,
    private editService: EditService,
    private snackBar: MatSnackBar,
    private http: HttpClientService
  ) { }




  // 必填設定
  basicFormGroup1 = new FormGroup({
    title: new FormControl('', Validators.required),        // 設置名稱欄必填
    description: new FormControl('', Validators.required),     // 設置說明欄必填
    startDate: new FormControl('', Validators.required),    // 設置日期選擇器欄位為必填
    endDate: new FormControl('', Validators.required)       // 另一個日期選擇器欄位為必填
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
  options: { optionNumber: string; option: string }[] = [];    // 選項的物件陣列

  // 下面是接收編輯模式時，正在編輯的問題的index
  editIndex: number | null = null;    // 用來儲存正在編輯項目的index


  trackByFn(index: number, item: any): any {
    return item.id; // 或者其他唯一标识符
  }

  // 動態新增選項
  addOption(): void {
    const newOptionNumber = (this.options.length + 1).toString(); // 新的 optionNumber 基於當前長度
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
      option.optionNumber = (index + 1).toString(); // 根據索引重新生成 optionNumber
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
      if ((questionType == 'single' || questionType == 'multi') && this.options.length < 2) {
        this.snackBar.open('選項數量不得少於兩個！', '關閉', { duration: 3000 });
        return;
      }

      // 更新選項編號以確保連續
      this.updateOptionNumbers();

      // 計算新的 questionId
      const maxQuestionId = Math.max(...this.questionData.map(q => q.questionId || 0), 0);
      const newQuestionId = this.editIndex !== null ? this.questionData[this.editIndex].questionId : maxQuestionId + 1;


      // 建立問題物件
      const question = {
        quizId: this.survey.id, // 使用當前問卷的 ID
        questionId: newQuestionId,    // 使用計算的 questionId
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



  ngOnInit(): void {
    // 設定選取日期最小值為當天
    this.startMinDate = this.dateService.changeDateFormat(this.dateService.addDate(new Date(), 2));
    // 設定選取日期最小值為當天+天
    this.endMinDate = this.dateService.changeDateFormat(this.dateService.addDate(new Date(), 7));


    // 獲取 EditService 中的數據
    const survey = this.editService.getSurvey();
    if (survey) {
      this.loadSurveyData(survey); // 載入數據
      return;
    }
    this.router.navigate(['/backMain']); // 無數據時返回主頁

  }


  // 載入問卷資料
  loadSurveyData(survey: any) {
    this.survey = survey;

    // 確保 quesList 存在且為數組
    const questionList = survey.quesList || [];
    console.log('原始问题数据:', questionList);

    try {
      // 將基本問卷資料填入 basicFormGroup1
      this.basicFormGroup1.patchValue({
        title: survey.title,
        description: survey.description,
        startDate: survey.startDate,
        endDate: survey.endDate,
      });

      // 因為已經在 EditService 中處理過 questionContent，直接使用
      this.questionData = questionList;

      console.log('載入後的問題數據:', this.questionData);
    } catch (error) {
      console.error('處理問卷資料時發生錯誤:', error);
    }
  }










  // 第一步驟把答案存到陣列裡面，再存入service

  // 接資料的總物件
  survey: any = {};

  // 新增完成先存入service，以便之後預覽
  preparePreview(): void {
    this.updateOptionNumbers(); // 確保選項編號正確
    this.survey = {
      ...this.survey,                       // 保留現有的 survey 資料（包括 id 和 published 等）
      ...this.basicFormGroup1.value,        // 問卷標題與說明
      questionData: this.questionData,      // 問題數據
    };
    console.log(this.survey);                                 // 確認資料是否成功添加
    this.backService.BackAnswer = this.survey;                // 存入service
  }


  prepareUpdatePayload(): any {
    const payload = {
      id: this.survey.id, // 確保傳遞正確的問卷 ID
      title: this.basicFormGroup1.value.title,
      description: this.basicFormGroup1.value.description,
      startDate: this.basicFormGroup1.value.startDate,
      endDate: this.basicFormGroup1.value.endDate,
      published: this.survey.published || false, // 如果未提供 `published` 默認為 false
      quesList: this.questionData.map((q) => ({
        quizId: this.survey.id,   // 綁定 Quiz ID
        questionId: q.questionId,
        questionTitle: q.questionTitle,
        questionType: q.questionType,
        required: q.required,
        questionContent: JSON.stringify(q.questionContent), // 將選項轉為 JSON 字符串
      })),
    };
    console.log('更新 Payload:', payload); // 檢查傳遞的數據
    return payload;
  }



  finalizeSurvey(): void {
    const updatePayload = this.prepareUpdatePayload(); // 整理數據
    this.http.putApi('http://localhost:8080/quiz/update', updatePayload)
      .subscribe({
        next: (res) => {
          console.log('成功儲存:', res);
          alert('問卷已更新！'); // 顯示成功提示
          this.editService.resetSurvey(); // 儲存成功後清空
          this.router.navigateByUrl('/backMain'); // 成功後跳轉頁面
        },
        error: (error) => {
          console.error('儲存過程中出現錯誤:', error);
          alert('更新失敗，請稍後再試！'); // 顯示錯誤提示
        }
      });
  }






  // 刪除問題
  selectedIndexes: number[] = [];

  onCheckboxChange(event: any, index: number): void {
    if(event.checked) {
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



  // 回首頁按鈕
  toMain() {
    this.editService.resetSurvey();
    this.router.navigateByUrl('/backMain');
  }
}
