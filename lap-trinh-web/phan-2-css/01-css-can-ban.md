# Bài 2.1 — CSS căn bản: quy tắc, chọn phần tử, màu sắc, chữ

## 1. CSS là gì và viết ở đâu?

**CSS = Cascading Style Sheets** — ngôn ngữ mô tả GIAO DIỆN: màu sắc, kích thước, vị trí, bố cục. Một dòng CSS cấu tạo:

```css
selector { property: value; }
bộ-chọn { thuộc-tính : giá-trị; }

h1       { color:        red; }
/* "chọn mọi thẻ h1, tô đỏ" */
```

### Ba cách nhúng CSS vào trang

```html
<!-- Cách 1: INLINE - dán trực tiếp lên thẻ bằng style -->
<p style="color: blue;">Chữ xanh</p>
<!-- Nhanh nhưng bẩn: trộn HTML với CSS, KHÔNG dùng trong đồ án trừ khi test nhanh -->

<!-- Cách 2: INTERNAL - viết trong thẻ style ở head -->
<style>
  p { color: green; }
</style>

<!-- Cách 3: EXTERNAL - file riêng, chuẩn cho đồ án -->
<link rel="stylesheet" href="css/style.css">
```

Quy tắc đồ án: **luôn dùng cách 3** (file riêng). Cùng một style.css nhúng vào mọi trang → đổi một chỗ, cả site đổi theo; giảng viên nhìn thấy là cộng điểm code sạch.

### Ai thắng khi nhiều quy tắc giẫm chân nhau? (specificity — cần thiết để debug)

Thứ tự ưu tiên từ cao xuống thấp:

1. `!important` (vũ khí hạt nhân - tránh dùng)
2. Inline `style="..."` 
3. Selector **ID** `#tuyetdoi`
4. Selector **class** `.nhieunguoi`
5. Selector thẻ `p`
6. Quy tắc nào được VIẾT SAU cùng thì thắng (khi ngang hàng)

> Ví dụ: nếu cả `p { color: gray }` và `.noi-bat { color: orange }` cùng bắn vào một `<p class="noi-bat">`, kết quả là MÀU CAM vì class mạnh hơn thẻ.

## 2. Bộ chọn (selectors) — vũ khí sử dụng CSS

```css
p            { }   /* chọn theo TÊN THẺ: mọi <p> */
.loi-nhan    { }   /* chọn theo CLASS: mọi phần tử có class="loi-nhan" - phổ biến nhất */
#logo        { }   /* chọn theo ID - duy nhất mỗi trang */
*            { }   /* chọn tất cả */

h1, h2, p    { }   /* nhóm nhiều selector dùng chung style - cách nhau bởi dấu phẩy */

nav a        { }   /* con cháu: chỉ <a> nằm BÊN TRONG <nav> mới bị bắt, <a> ngoài nav thì không */

a:hover      { }   /* pseudo-class: trạng thái rê chuột lên link */
li:first-child  { } /* phần tử con đầu tiên */
li:nth-child(odd){} /* dòng lẻ - hay dùng kẻ sọc bảng */
```

HTML tương ứng nhớ đi nhớ lại:

```html
<h1 id="logo" class="loi-nhan">...</h1>
```

Một phần tử có thể mang nhiều class (cách nhau khoảng trắng): `<div class="the-san-pham giam-gia">` — tổ hợp này chính là tư tưởng dựng UI hiện đại.

Bộ chọn có dấu cách (`nav a`) và không dấu cách (`a.nav`) khác nhau hoàn toàn:

```css
div.card     { }  /* 1 từ: chỉ chọn div CÓ class card */
div .card    { }  /* 2 từ: chọn .card nằm bên trong div bất kỳ */
```

## 3. Màu sắc và đơn vị đo

### 4 cách ghi màu

```css
color: tomato;                 /* tên sẵn - hạn chế, khó nhớ */
color: #ff6347;                /* hex 6 số - CHUẨN phổ biến nhất, #fff = trắng */
color: rgb(255, 99, 71);       /* tỷ lệ đỏ-xanh lá-xanh dương 0-255 */
color: rgba(255, 99, 71, 0.5); /* a = alpha độ mờ 0-1 - dùng làm lớp phủ mờ */
```

Mẹo phân biệt giá trị 3 kênh: `rgb(255,0,0)` = đỏ nguyên chất, tăng đủ ba kênh lên `rgb(120,120,120)` thành xám, `rgb(255,255,255)` = trắng.

### Đơn vị đo

| Đơn vị | Ý nghĩa | Khi nào dùng |
|---|---|---|
| `px` | pixel tuyệt đối | viền, bo góc, kích thước ảnh nhỏ |
| `%` | so với cha | chiều rộng khối |
| `em` | gấp đôi kích thước CHỮ của chính nó | giãn chữ |
| `rem` | so với font gốc của trang (thường 16px) | kích thước chữ toàn trang |
| `vw/vh` | % chiều rộng/cao màn hình | hero full màn hình |

**Vì sao người ta thích rem?** Người dùng chỉnh cỡ chữ mặc định trình duyệt (người già chỉnh to) thì cả trang co giãn theo — thân thiện tiếp cận hơn px.

## 4. Nhóm thuộc tính chữ

```css
h2 {
  color: #222;
  font-family: Arial, "Segoe UI", sans-serif;   /* dự phòng xong xuôi */
  font-size: 24px;
  font-weight: bold;          /* hoặc 100..900 - normal=400 bold=700 */
  font-style: italic;
  text-align: center;         /* left | center | right | justify */
  text-decoration: none;      /* underline | none - bỏ gạch chân link rất hay dùng */
  text-transform: uppercase;  /* lowercase | capitalize */
  letter-spacing: 2px;        /* giãn/kẹp giữa các ký tự */
  line-height: 1.6;           /* khoảng cách giữa các dòng (số chưa đơn vị = hệ số) */
}
```

Quy tắc bố trí font chuẩn ngành: ghi **danh sách dự phòng** kết thúc bằng generic family (`sans-serif`, `serif`, `monospace`) — máy người xem thiếu font bạn chọn thì còn fallback đẹp.

Demo đọc hiểu nhanh — thử paste vào file rồi mở:

```html
<!DOCTYPE html><html><head><style>
  .khuyen-mai {
    color: crimson;
    text-align: center;
    letter-spacing: 3px;
    line-height: 2;
    font-weight: 700;
  }
</style></head><body>
  <p class="khuyen-mai">SALE CUỐI KỲ GIẢM 40%</p>
</body></html>
```

## Checklist tự kiểm tra

- [ ] Thuộc ra cú pháp `selector { property: value; }` và dấu `;` sau mỗi khai báo
- [ ] Biết 3 cách nhúng CSS và lý do đồ án phải dùng file ngoài
- [ ] Xếp đúng thứ tự ưu tiên ID > class > thẻ
- [ ] Giải thích khác nhau `div.card` và `div .card`
- [ ] Viết được mã hex của một màu bất kỳ tự chọn
