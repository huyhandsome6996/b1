# Đề cương ôn tập — Tóm tắt kiến thức + 30 bài tập có lời giải

Cách dùng: **giấu phần đáp án, tự làm trên giấy trước**, rồi mở đáp án đối chiếu. Làm sai chỗ nào thì quay lại đúng bài lý thuyết đó đọc lại.

## PHẦN A — Cheat sheet tóm tắt toàn môn

### A1. HTML

| Cần nhớ | Chi tiết |
|---|---|
| Khung chuẩn | `<!DOCTYPE html>` → `<html lang="vi">` → `<head>` (meta charset UTF-8, viewport, title) → `<body>` |
| Nội dung chữ | `h1–h6`, `p`, `br`, `hr`, `strong`, `em`, `mark` |
| Link & ảnh | `a href` (+ `target="_blank"` tab mới), `img src alt width` |
| Danh sách | `ul`(chấm)/`ol`(số) chứa `li`, lồng được nhiều tầng |
| Bảng | `table > thead/tbody > tr > th/td`; gộp ô `colspan`(ngang) `rowspan`(dọc) |
| Form | `label for` = `input id`; input type: text/email/password/number/date/radio/checkbox/file; radio cùng `name` = nhóm chọn 1; textarea, select>option, button submit/reset |
| Ngữ nghĩa | header, nav, main(1 trang), section, article, aside, footer |

### A2. CSS

| Cần nhớ | Chi tiết |
|---|---|
| Nhúng file | `<link rel="stylesheet" href="css/style.css">` |
| Selector | thẻ `p`, class `.x`, id `#y`, con cháu `nav a`; ưu tiên id > class > thẻ |
| Màu & đơn vị | hex `#fff`, `rgba(r,g,b,alpha)`; px/% /rem/vw-vh |
| Chữ | color, font-family (kèm dự phòng), font-size/weight, text-align, line-height |
| Box model | content → padding → border → margin; **luôn reset**: `*{box-sizing:border-box;margin:0}` |
| Căn giữa khối | `width` cố định + `margin: 0 auto` hoặc flex `justify-content:center` |
| Flexbox | cha `display:flex; justify-content(+trục chính); align-items(+trục ngang); gap` |
| Grid | `grid-template-columns: repeat(3, 1fr); gap` |
| Position | relative (mốc), absolute (neo vào mốc), fixed/sticky (dính màn hình) |
| Responsive | meta viewport + `@media (max-width: 768px){...}`; mobile xếp 1 cột |
| Hiệu ứng | `transition: all .3s` + hover; keyframes + animation cho tự chạy |

### A3. JavaScript

| Cần nhớ | Chi tiết |
|---|---|
| Nhúng file | `<script src="js/script.js" defer></script>` cuối body |
| Biến | mặc định `const`, sẽ đổi giá trị mới dùng `let`; bỏ var cũ kỹ |
| Kiểu | string number boolean undefined null; kiểm tra `typeof` |
| Ghép chuỗi | template literal `` `Tổng: ${tong}đ` `` |
| So sánh | LUÔN `===` / `!==`, không dùng `==` |
| Điều kiện | if/else if/else; ternary `dk ? a : b`; switch...case...break |
| Vòng lặp | `for (let i=0;i<n;i++)`, while, break/continue; duyệt mảng `for...of` |
| Hàm | `function ten(thamso){ return ... }`; arrow `x => x*2` |
| Mảng | index từ **0**; push/pop/shift/unshift; map/filter/find/forEach |
| Object | `{key: value}` truy cập dấu chấm; mảng object = dữ liệu đồ án |
| DOM | `getElementById("id")`, `querySelector(".lop")` |
| Sửa nội dung | `.textContent`, `.value`, `.style.tênThuộcTínhCamelCase`, `.classList.toggle()` |
| Sự kiện | `addEventListener("click"/"input"/"submit", fn)`; form phải `e.preventDefault()` |
| Random nguyên | `Math.floor(Math.random()*N)+1` |

---

## PHẦN B — 30 bài tập tự luyện

### Nhóm HTML (câu 1–8)

1. Viết khung file HTML5 hoàn chỉnh cho trang tiếng Việt.
2. Có lỗi nào trong đoạn này? `<p>Ăn <strong>ngon<b></strong></b> sống khỏe</p>`
3. Viết link mở Google ở tab mới, và dòng chữ bấm được "Xem ảnh" cuộn tới phần tử có id="anh".
4. Chèn ảnh `images/meo.jpg`, rộng 300px, có mô tả thay thế đầy đủ.
5. Làm bảng 2×2: hàng đầu tên "Môn" - "Điểm" ô tiêu đề; dữ liệu Toán 9.
6. Gộp cột: ô "Tổng cộng" phải ăn ngang 3 cột thì viết thuộc tính gì?
7. Form hỏi giới tính chỉ được chọn 1: viết bằng radio hay checkbox? Vì sao cần cùng name?
8. Xếp các thẻ sau vào vai trong layout semantic: `<footer>, <nav>, <main>, <header>`.

### Nhóm CSS (câu 9–16)

9. Nhúng file `css/style.css` vào trang — viết thẻ đúng.
10. Khoảng cách bên TRONG viền và NGOÀI viền lần lượt là thuộc tính nào?
11. Selector nào thắng: `#menu a {color:red}` hay `.menu-link {color:green}` (phần tử có cả hai)? Vì sao?
12. Cho một khối `width:400px`, làm sao căn giữa trang?
13. Cú pháp gradient chuyển sắc 2 màu cho nền là gì? Viết mẫu.
14. Navbar flexbox: logo trái menu phải, đứng giữa dọc — viết 4 dòng CSS.
15. Chỉnh grid sản phẩm còn 1 cột khi màn hình ≤ 600px — viết media query.
16. Đoạn này ảnh hưởng gì? `display:none` so với `opacity:0`.

### Nhóm JavaScript (câu 17–30)

17. Khác nhau `let` vs `const`? Khi nào dùng cái nào?
18. Đoán output: `console.log(typeof 12, typeof "12", typeof true);`
19. `5 == "5"` và `5 === "5"` ra gì? Nên dùng cái nào khi so sánh?
20. Viết hàm nhận điểm số trả về "Đậu" nếu ≥ 5 ngược lại "Rớt" (dùng ternary).
21. Sửa lỗi logic: muốn in 1→5 nhưng đoạn này in sai — tìm lỗi: `for(let i=1;i<=5;i--){console.log(i)}`
22. Đoán output:
```js
let s = 0;
for (let i = 1; i <= 4; i++) s += i;
console.log(s);
```
23. Phân tích: vòng while thiếu bước tăng gây hậu quả gì?
24. Cho `sp = ["Bánh","Kẹo","Trà"]`: viết lấy phần tử cuối KHÔNG hardcode số.
25. Thêm "Cà phê" vào CUỐI mảng trên, rồi xoá phần tử ĐẦU.
26. `filter` giữ số chẵn từ `[3, 6, 9, 12]`.
27. Đoán output:
```js
const sv = {ten:"An", diem: 8};
sv.diem = sv.diem + 1;
console.log(`${sv.ten}: ${sv.diem}`);
```
28. Lấy phần tử có id="tieuDe" đổi chữ thành "Xin chào".
29. Khi bắt sự kiện submit form tại sao gọi `e.preventDefault()`?
30. Công thức tạo số nguyên ngẫu nhiên từ 1 đến 100?

---

## PHẦN C — Đáp án chi tiết

<details>
<summary><strong>Bấm để mở đáp án câu 1–10</strong></summary>

1.
```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tiêu đề tab</title>
</head>
<body>
  <h1>Nội dung</h1>
</body>
</html>
```

2. Sai thứ tự đóng thẻ: thẻ `strong` chưa đóng đã đóng `b`. Chuẩn:
`<p>Ăn <strong>ngon</strong> sống khỏe</p>` (nếu định lồng: `<strong><b>...</b></strong>`).

3.
```html
<a href="https://google.com" target="_blank">Google tab mới</a>
<a href="#anh">Xem ảnh</a>
```

4. `<img src="images/meo.jpg" alt="Con mèo tam thể đang nằm ngủ" width="300">`

5.
```html
<table border="1">
  <thead><tr><th>Môn</th><th>Điểm</th></tr></thead>
  <tbody><tr><td>Toán</td><td>9</td></tr></tbody>
</table>
```

6. `colspan="3"`: `<td colspan="3">Tổng cộng</td>`

7. Dùng **radio**, vì radio + cùng `name` tạo nhóm loại trừ (chọn A mất B). Checkbox cho tick nhiều.

8. `<header>` logo/banner trên cùng → `<nav>` menu điều hướng → `<main>` nội dung chính → `<footer>` chân trang bản quyền.

9. `<link rel="stylesheet" href="css/style.css">` đặt trong `<head>`.

10. Trong viền = `padding`; ngoài viền = `margin`.
</details>

<details>
<summary><strong>Bấm để mở đáp án câu 11–20</strong></summary>

11. Quy tắc `#menu a` thắng vì có **ID** trong selector, ID mạnh hơn class bất kể thứ tự xuất hiện.

12. `div { width: 400px; margin: 0 auto; }` (auto hai biên ngang). Hoặc cha flex `justify-content:center`.

13. `background: linear-gradient(135deg, #667eea, #764ba2);`

14.
```css
.navbar {
  display: flex;
  justify-content: space-between;  /* trái - phải */
  align-items: center;             /* giữa theo chiều dọc */
  padding: 14px 5%;
}
```

15.
```css
@media (max-width: 600px) {
  .products { display: grid; grid-template-columns: 1fr; }
}
```

16. `display:none`: biến mất + giải phóng chỗ (layout co lại). `opacity:0`: vô hình NHƯNG vẫn chiếm nguyên diện tích, còn nhận click. Muốn ẩn thật + giữ chỗ: `visibility:hidden`.

17. `let` gán lại thoải mái (biến đếm, tổng cộng dồn). `const` khóa tham chiếu — mọi thứ khác. Mặc định const, cần đổi mới let.

18. `number string boolean`.

19. `5 == "5"` → true (chuyển kiểu rồi so). `5 === "5"` → false (khác kiểu). So sánh thực chiến luôn dùng `===`.

20.
```js
function kiemTra(diem) {
  return diem >= 5 ? "Đậu" : "Rớt";
}
```
</details>

<details>
<summary><strong>Bấm để mở đáp án câu 21–30</strong></summary>

21. `i--` làm i GIẢM mãi mãi: 1, 0, -1,... chạy vô hạn treo trình duyệt. Sửa thành `i++`.

22. s = 1+2+3+4 = **10**.

23. Chạy vô hạn (infinite loop) — điều kiện không bao giờ trở thành sai, trình duyệt treo đến mức phải giết tab. Luôn đảm bảo biến trong điều kiện có bước thay đổi.

24. `sp[sp.length - 1]` → "Trà".

25. `sp.push("Cà phê"); sp.shift();` → `["Kẹo","Trà","Cà phê"]`.

26.
```js
[3,6,9,12].filter(n => n % 2 === 0)   // [6, 12]
```

27. In: `An: 9` (object được sửa qua dot notation; template literal chèn kết quả).

28.
```js
document.getElementById("tieuDe").textContent = "Xin chào";
// hoặc: document.querySelector("#tieuDe").textContent = "Xin chào";
```

29. Không chặn thì hành vi mặc định của form là GỬI YÊU CẦU VÀ TẢI LẠI TRANG — mọi thay đổi JS vừa làm bị xoá sạch, người dùng không thấy thông báo kết quả.

30. `Math.floor(Math.random() * 100) + 1;`
</details>
