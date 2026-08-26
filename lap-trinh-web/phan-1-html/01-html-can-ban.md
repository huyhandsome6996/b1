# Bài 1.1 — HTML căn bản

## 1. HTML là gì?

**HTML = HyperText Markup Language** — ngôn ngữ ĐÁNH DẤU (không phải ngôn ngữ lập trình). Nó không có biến, không có if...for; nhiệm vụ duy nhất là **mô tả trang web có những nội dung gì và cấu trúc ra sao**: đây là tiêu đề, đây là đoạn văn, đây là ảnh, đây là nút...

## 2. Thẻ (tag), phần tử (element), thuộc tính (attribute)

Cú pháp nền móng của toàn bộ môn học:

```html
<p class="mo-dau">Học lập trình web rất vui!</p>
└┬┘ └─────┬─────┘ └───────────┬────────────┘ └┬┘
thẻ mở   thuộc tính      nội dung          thẻ đóng
```

- **Tag:** tên nằm trong `< >`. Hầu hết có cặp mở–đóng (thẻ đóng thêm dấu `/`).
- **Element (phần tử)** = thẻ mở + nội dung + thẻ đóng.
- **Attribute (thuộc tính):** thông tin bổ sung, luôn đứng TRONG THẺ MỞ, dạng `tên="giá trị"`.
- Một số thẻ **tự đóng** không cần thẻ đóng: `<img>`, `<br>`, `<hr>`, `<input>`, `<meta>`, `<link>`.
- HTML phân biệt chữ hoa chữ thường? Không bắt buộc (`<P>` vẫn chạy) nhưng quy ước viết **chữ thường**.
- Comment (ghi chú, trình duyệt bỏ qua): `<!-- dòng này không hiện -->`

## 3. Khung chuẩn của mọi file HTML

Trong VS Code gõ `!` rồi Tab sẽ sinh ra:

```html
<!DOCTYPE html>               <!-- khai báo: đây là HTML5 -->
<html lang="vi">              <!-- gốc của cả trang; lang=ngôn ngữ chính -->
  <head>                      <!-- phần "hậu trường": thông tin cho trình duyệt, KHÔNG hiện ra màn hình -->
    <meta charset="UTF-8">    <!-- bảng mã cho tiếng Việt có dấu - THIẾU LÀ BỊ LỖI FONT -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- để responsive được -->
    <title>Tiêu đề trên tab trình duyệt</title>
  </head>
  <body>
    <h1>Mọi thứ nhìn thấy đều nằm trong body</h1>
  </body>
</html>
```

Quy tắc **lồng nhau như hộp ruột**: `<html>` chứa `<head>`+`<body>`; phần tử con phải đóng trước khi cha đóng — sai trật tự lồng là lỗi phổ biến nhất của tuần đầu học.

## 4. Thẻ chữ — nhóm dùng nhiều nhất

```html
<h1>Tiêu đề lớn nhất</h1>          <!-- h1 đến h6: tiêu đề giảm dần độ lớn -->
<h2>Tiêu đề mục</h2>
<p>Một đoạn văn bản.</p>            <!-- paragraph: tự cách nhau 1 dòng trống -->

<strong>Chữ đậm nhấn mạnh</strong>   <!-- nhìn giống b nhưng mang ý nghĩa quan trọng -->
<em>Chữ nghiêng nhấn nhẹ</em>
<u>Gạch chân</u> <mark>Tô vàng</mark> <small>Chữ nhỏ phụ chú</small>
<br>       <!-- xuống dòng NGAY trong cùng đoạn -->
<hr>       <!-- vạch kẻ ngang chia mục -->
```

⚠️ Cảnh báo: gõ Enter nhiều lần trong code **không** tạo khoảng trống trên web — trình duyệt gộp mọi khoảng trắng thành một. Muốn xuống dòng phải dùng đúng thẻ `<br>` hay tách thành các `<p>` riêng.

Ví dụ ghép:

```html
<h1>Nấm đùi gà chiên bơ</h1>
<p><strong>Nguyên liệu:</strong> nấm đùi gà, bơ, tỏi.</p>
<p>Cắt nấm lát dày.<br>Phi tỏi với bơ, cho nấm vào xào lửa lớn.</p>
<hr>
<small>Công thức của mẹ - ghi lại ngày 20/8</small>
```

## 5. Liên kết `<a>` (anchor)

```html
<a href="https://google.com">Mở Google</a>            <!-- link ngoài -->
<a href="gioi-thieu.html">Trang giới thiệu</a>         <!-- link file cùng thư mục -->
<a href="baitap/bai1.html">Bài tập thư mục con</a>     <!-- đi vào thư mục con -->
<a href="../index.html">Về trang chủ</a>              <!-- .. = lùi ra thư mục cha -->
<a href="#lien-he">Nhảy tới mục Liên hệ</a>            <!-- anchor trong trang -->
<a href="https://gmail.com" target="_blank">Mở tab mới</a> <!-- target_blank = tab mới -->
```

Tạo điểm neo để nhảy tới trong trang dài:

```html
<a href="#cuoi-trang">Xuống cuối trang</a>

<h2 id="cuoi-trang">Phần cuối trang</h2>   <!-- phần tử đích phải có id trùng khớp -->
```

## 6. Hình ảnh `<img>`

```html
<img src="images/meo.jpg" alt="Con mèo cam đang ngủ" width="300">
<!--     đường dẫn ảnh           chữ thay thế khi ảnh lỗi      đơn vị pixel -->
```

- `src`: nguồn ảnh — **relative path** (so với file html hiện tại) hoặc URL tuyệt đối internet.
- `alt` bắt buộc theo chuẩn: mô tả ảnh cho người mù dùng màn hình đọc, và hiện ra khi ảnh hỏng.
- `width`/`height` tính bằng pixel. Thiếu 1 chiều thì tự giữ tỷ lệ.
- Phần tử `<figure>` bọc ảnh + `<figcaption>` ghi chú dưới ảnh.

```html
<figure>
  <img src="images/cafe.jpg" alt="Ly cà phê sữa đá" width="400">
  <figcaption>Hình 1. Cà phê sữa đá ngày mưa</figcaption>
</figure>
```

## 7. Danh sách: `<ul>`, `<ol>`, `<li>`

```html
<ul>                          <!-- ul = unordered list: chấm tròn -->
  <li>Cơm</li>
  <li>Canh chua</li>
</ul>

<ol>                          <!-- ol = ordered list: số thứ tự -->
  <li>Đun nước sôi</li>
  <li>Cho mì vào</li>
</ol>
```

Lồng được: danh sách nằm trong mục khác

```html
<ul>
  <li>Đồ uống
    <ul>
      <li>Trà</li>
      <li>Cà phê</li>
    </ul>
  </li>
</ul>
```

## 8. Hai "hộp giấy" vạn năng: `div` và `span`

| Thẻ | Loại | Dùng để |
|---|---|---|
| `<div>` | block — chiếm nguyên dòng | GOM MỘT KHỐI nhiều phần tử lại để style/căn layout |
| `<span>` | inline — chỉ rộng bằng chữ | Bọc vài từ bên trong câu để tô màu |

```html
<div class="the-tin">
  <h3>Nguyễn Văn A</h3>
  <p>Sinh viên năm nhất</p>
</div>

<p>Tuition chỉ còn <span class="sale">giảm 50%</span> tháng này.</p>
```

## Checklist tự kiểm tra

- [ ] Viết được khung `!`+Tab và giải thích tác dụng từng dòng
- [ ] Phân biệt attribute đứng ở đâu (trong thẻ mở)
- [ ] Tạo link mở tab mới, tạo anchor nhảy trong trang
- [ ] Chèn ảnh kèm alt, hiểu relative path `../`
- [ ] Tạo ul/ol và biết div/span khác nhau thế nào

Bài thực hành tổng hợp cả bài → mở file `phan-1-html/vi-du/index.html`.
