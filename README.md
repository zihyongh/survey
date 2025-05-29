# 動態問卷平台（Angular + Spring Boot）

本專案是一個整合前後端的動態問卷系統，使用 Angular 負責前端畫面與互動設計，後端則由 Spring Boot 開發 RESTful API，提供問卷新增、編輯、查詢與刪除功能。使用者可以建立具有多種類型問題的問卷，並記錄填答資料。

## 技術使用

### 前端
- Angular 18
- Angular Material（UI 元件）
- Reactive Forms / FormGroup

### 後端
- Java 17
- Spring Boot 3
- Spring MVC（RESTful API 設計）
- Spring Data JPA
- MySQL
- Postman（API 測試）

## 核心功能

### 問卷管理
- 問卷列表查詢（前後台）
- 建立新問卷（含標題、說明）
- 新增多種類型的問題（單選、複選、文字填寫）
- 設定每題是否必填
- 編輯 / 刪除問題
- 問卷儲存與送出

### 填寫問卷
- 使用者可依序填寫問卷步驟（Stepper）
- 動態顯示不同題型的輸入欄位
- 表單驗證與送出功能

### 其他功能
- 使用 mat-stepper 實作多步驟填寫
- 問卷結果統計（未來可拓展）

