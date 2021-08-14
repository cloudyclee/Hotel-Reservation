# 訂房網站前端頁面

此專案為第二屆 F2E [第六關](https://challenge.thef2e.com/news/17)的內容。主要是為了練習使用 Ajax 與後端串接以及根據設計稿來切版。

需求為製作兩個頁面：頁面與單一房型介紹，各頁面包含以下功能：

1. 首頁：能看到所有房型，並能點擊任一房型，進入到單一房型頁面觀看更多
2. 單一房型頁面：
	- 使用者可以觀看該房型詳細資訊，例如旅館描述、平日價格(一~四)、假日價格(五~日)、checkIn 時間、其他服務
	- 使用這可以用日曆方式，瀏覽未來 90 天已預約與尚未預約的時段。
	- 使用者在選擇預約日期時，會即時顯示訂房價格總價
	- 使用者可以線上訂房，需填寫的欄位有姓名、電話、預約起迄，且只能預約未來 90 天內的時段
	- 若預約失敗，會回傳訊息讓客戶知曉，失敗原因項目如下
		- 預訂 90 天後
		- 預約時間已被人預訂
		- 預約的是過去時間
		
## 使用工具

此專案使用 Sass 編寫 CSS，並使用 VSCode 套件匯出成css檔。另外，以 CDN 方式引入 Bootstrap 協助排版；引入 jQuery 完成網站互動行為、引入 Vue3 並使用其模板語法；最後是引入 loaders 套件處理 API 傳書資料時的等待畫面。

## 功能實現

- 首頁
	- 定義 Vue data：rooms 陣列 ( 所有房型資料 )、room 物件 ( 目前選中房型，含 index、id、名稱 )
	- 以 XMLHttprequest 實作 Ajax，首先 get 所有房型。
	- xhr 事件尚未完成前，頁面顯示以 loaders 套件製作等待畫面
	- xhr 事件完成後，等待畫面消除，rooms 接收 API 資料；掛載 vue 實體
	- HTML 中以 rooms 資料 v-for 渲染房型列表
	- 列表項目為超連結，並設定連結 URL 為 singleRoom.html，並附帶兩項參數，房型索引與名稱
	- 使用者游標指向列表中的房型時，改變 room 的資料，以改變頁面資訊與背景圖片

- 單一房型頁面
	- 定義 Vue data：room ( 房型資料 )
	- 從網址解析出參數，並以參數形式夾帶在請求的 URL 中，以 XMLHttprequest 向 API 送出 get 請求
	- xhr 事件尚未完成前，頁面顯示以 loaders 套件製作等待畫面
	- xhr 事件完成後，等待畫面消除，room 接收 API 傳回之資料；掛載 vue 實體
	- HTML 中以 room 渲染頁面資訊
	- 以自製的日曆元件，提供使用者選擇日期：
		* 過去與 90 天後的日期無法選擇
		* 已被預定的日期僅能當作退房日 (已被預定的日期包含在 API 返回的資料中 )
		* 剩餘日期可自由選擇。先選擇一日期再選擇另一日期，程式依照日期先後判斷日期起迄，並且連帶選中起訖日區間內的所有日期
	- 按下「預約時段」按鈕，填寫姓名、電話、日期起訖即可預約
		* 若使用者在日曆上已有選擇日期，則程式會自動帶入該日期 ( 若僅選擇一個日期，則會判定為起始日 )
		* 根據使用者選擇的日期區段，判斷平日假日，分別計算出平日總和、假日總和以及總計金額，並回饋於畫面中
		* 預約表單綁定 change 事件，若各項資料未填寫或有錯誤，則會在表單上以紅色小字回饋使用者
		* 表單內的日期選擇也按照規則。以 jQuery 動態設定起訖日的 min & max ( 例如選定起始日後，結束日的 min 為起始日 +1，max 為現在日期 +90 )
		* 若表單驗證有誤，則禁用「確認預約」按紐
		* 確認預約後，將姓名、電話、預約的所有日期包成物件，並夾帶在 request body 中，以 fetch 方法向 API 送出 post 請求
		* 若使用者預約時段中包含已被預約的時段，則會顯示預約失敗的對話框，若無則顯示預約成功之對話框

- 額外網頁互動
	- 單一房型頁面最上方為導航列，一開始為透明色，隨捲軸捲動逐漸變為白色 ( 實作方式請參考我的[上一個作品](https://github.com/cloudyclee/Brand_website) )
	- 點擊導航列的 logo 可返回首頁
	- 頁面載入成功後，視窗自動捲動至房間資訊區塊
	- 單一房型頁面上方為房間照片，點擊任一圖片則開啟相片簿，並顯示點擊之照片。可以使用左右按鈕瀏覽相簿
