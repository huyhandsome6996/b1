# Bài 2.4 — Responsive, biến CSS, hiệu ứng chuyển động

## 1. Responsive — một trang khớp mọi màn hình

Responsive = website tự xếp lại đẹp trên desktop, tablet, điện thoại (xem bằng DevTools `Ctrl+Shift+M`).

### Bước buộc phải có #1: meta viewport

Trong `<head>` của MỌI trang phải có dòng này, thiếu là mobile phóng hốt toàn bộ trang thu nhỏ như xem ảnh chụp:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Media query — lệnh điều kiện theo kích thước

```css
/* Mặc định: viết cho MOBILE TRƯỚC (mobile-first) */
.noi-dung { padding: 12px; }

/* Từ 768px trở LÊN mới áp dụng */
@media (min-width: 768px) {
  .noi-dung { padding: 40px; }
}
```

Hoặc kiểu "max-width" — dưới ngưỡng thì áp:

```css
@media (max-width: 600px) {
  .menu { flex-direction: column; }      /* menu dọc trên điện thoại */
  .gian-hang { grid-template-columns: 1fr; }
}
```

### Breakpoint kinh điển

| Ngưỡng | Thiết bị |
|---|---|
| < 576px | điện thoại |
| 576 – 991px | tablet |
| ≥ 992px | desktop |

Chiến thuật quen thuộc nhất đồ án: grid sản phẩm 3 cột → 2 cột ở tablet → 1 cột ở mobile.

```css
.products { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 900px)  { .products { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 576px)  { .products { grid-template-columns: 1fr; } }
```

Chú ý thứ tự viết khi dùng max-width: **ngưỡng lớn viết trước, nhỏ viết sau** để quy tắc sau ghi đè đúng ý.

## 2. CSS Variables — khai báo màu tại một chỗ

Đổi theme cả trang chỉ cần đổi vài dòng đầu:

```css
:root {
  --mau-chinh: #2563eb;
  --chu-den: #1e293b;
  --nen-trang: #f8fafc;
}

body        { color: var(--chu-den); background: var(--nen-trang); }
.btn        { background: var(--mau-chinh); }

/* Dark mode toàn trang chỉ là đảo giá trị - JS sẽ bật/tắt class này ở Phần 3 */
body.dark {
  --chu-den: #f1f5f9;
  --nen-trang: #0f172a;
}
```

Ghi nhớ quy tắc: định nghĩa bằng `--ten`, sử dụng bằng `var(--ten)`.

## 3. Transition + transform — chuyển động mượt

Nguyên tắc đắt tiền của ngành UI: đừng cho trạng thái thay đổi gọn lỏn, hãy TỎ LỢI về trạng thái cũ từ từ.

```css
/* Xác định thuộc tính nào chuyển đổi, trong bao lâu, cong chạy nào */
.hop {
  transition: all .3s ease;    /* .3s đủ nhanh không gây khó chịu */
}
```

| Cặp tình nhân | Kết quả |
|---|---|
| `transform: scale(1.1)` | nút phình to 10% khi hover |
| `transform: translateY(-6px)` | card nhấc lên |
| `transform: rotate(360deg)` | quay tròn |
| `opacity: 0 → 1` | mờ dần hiện ra |
| `background-color` đổi màu | mượt không giật |

Combo menu hover mở khó tin dễ thương:

```css
.item {
  position: relative;
}
.item::after {                            /* pseudo-element: giả viền phát sáng */
  content: "";
  position: absolute;
  left: 0; bottom: 0;
  width: 0; height: 2px;
  background: var(--mau-chinh);
  transition: width .3s;
}
.item:hover::after { width: 100%; }       /* vẽ vạch chạy hết chiều dài chữ */
```

## 4. Animation bằng keyframes — chạy không cần ai bấm

Transition chỉ hoạt động khi TRẠNG THÁI ĐỔI (hover chẳng hạn). Muốn tự chạy vô hạn dùng `@keyframes`:

```css
@keyframes bay-len {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.banner {
  animation: bay-len 0.8s ease-out both;
}
@keyframes xoay-khung {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.loader { animation: xoay-khung 1s linear infinite; } /* spinner quay chờ load */
```

Quy tắc an toàn: animation chỉ nên chạy nhanh, không để flash nhiều lần liên tục — gây chóng mặt người xem và trừ điểm UX.

## 5. Các pseudo-class bổ trợ đáng thuộc

```css
input:focus     { outline: 2px solid var(--mau-chinh); } /* ô đang gõ sáng viền */
tr:nth-child(even) { background: #fafafa; }               /* kẻ sọc bảng */
.menu a.active  { font-weight: bold; }                     /* mục menu đang đứng */
p::first-letter { font-size: 200%; }                       /* chữ hoa mở đầu báo chí */
::selection     { background: yellowgreen; }                /* màu nền khi quét chọn */
```

## Checklist tự kiểm tra

- [ ] Mọi file HTML có meta viewport
- [ ] Viết media query đổi số cột grid theo 3 breakpoint chuẩn
- [ ] Dùng biến CSS tạo theme và làm dark mode bằng cách đảo giá trị
- [ ] Làm button hover scale + transition mượt
- [ ] Viết keyframes tự chạy (fade-in, loading xoay)
