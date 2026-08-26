# Bài 1.2 — Bảng, Form, thẻ ngữ nghĩa, media

## 1. Bảng `<table>`

Bảng dùng để hiển thị **dữ liệu dạng lưới** (bảng điểm, bảng giá...). KHÔNG dùng table để dàn trang — dàn trang là việc của CSS (Flexbox/Grid, bài 2.3).

```html
<table border="1">        <!-- border để nhìn thấy khung khi chưa có CSS -->
  <thead>                <!-- phần tiêu đề -->
    <tr>                 <!-- tr = table row: một dòng -->
      <th>Tên</th>       <!-- th = table header: ô tiêu đề (tự đậm + giữa) -->
      <th>Lớp</th>
    </tr>
  </thead>
  <tbody>                <!-- phần thân dữ liệu -->
    <tr>
      <td>An</td>        <!-- td = table data: ô dữ liệu thường -->
      <td>SE1801</td>
    </tr>
    <tr>
      <td>Bình</td>
      <td>SE1802</td>
    </tr>
  </tbody>
</table>
```

Kết cấu nhớ nhanh: **table → thead/tbody → tr → th/td** (3 tầng lồng, thiếu tầng nào là vỡ).

Gộp ô:

```html
<tr>
  <th colspan="2">Bảng điểm tổng hợp</th>   <!-- colspan: ăn ngang 2 cột -->
</tr>
<tr>
  <td rowspan="2">Học kỳ 1</td>              <!-- rowspan: ăn dọc 2 dòng -->
  <td>Toán 8 điểm</td>
</tr>
<tr><td>Văn 9 điểm</td></tr>                  <!-- dòng này chỉ có 1 td vì cột đầu bị rowspan chiếm -->
```

## 2. Form — form nhập liệu

Form là "cửa" nhận thông tin người dùng (đăng ký, đăng nhập, tìm kiếm, liên hệ). Mọi đồ án cuối kỳ gần như đều bắt buộc có form.

### Khung ngoài

```html
<form action="/dang-ky" method="post">
  <!-- các control nằm ở đây -->
</form>
<!-- action: dữ liệu gửi đi đâu; method: cách gửi (get hiện trên URL, post giấu đi) -->
```

### Nguyên tắc VÀNG: label luôn ghép với input bằng id

```html
<label for="ten">Họ và tên:</label>
<input type="text" id="ten" name="fullname">
<!--     for của label = id của input --> 
<!--     name là tên biến gửi về server - mọi input cần có -->
```

Làm vậy lợi kép: bấm vào chữ nhãn thì ô nhập tự focus, và trình duyệt đọc màn hình hiểu quan hệ.

### Các `type` của `<input>` — học thuộc nhóm này

| type | Tác dụng |
|---|---|
| `text` | chữ thường |
| `password` | che thành dấu chấm |
| `email` | tự kiểm tra định dạng @ |
| `number` | chỉ số, kèm min/max/step |
| `date` | lịch chọn ngày |
| `radio` | chọn 1 trong nhóm (cùng `name`) |
| `checkbox` | tick nhiều lựa chọn |
| `file` | tải file lên |
| `range` | thanh kéo giá trị |
| `color` | bảng màu |

Thuộc tính hay đi kèm: `placeholder` (chữ mờ gợi ý), `value` (giá trị mặc định), `required` (bắt buộc), `min`/`max`, `readonly`, `disabled`.

Ví dụ nguyên mẫu:

```html
<form>
  <p>
    Giới tính:
    <input type="radio" id="nam" name="gioitinh" value="nam"><label for="nam">Nam</label>
    <input type="radio" id="nu" name="gioitinh" value="nu"><label for="nu">Nữ</label>
    <!-- cùng name=... nên radio biết đây là NHÓM -> chỉ được chọn 1 -->
  </p>
  <p>
    Sở thích:
    <input type="checkbox" id="da_bong" name="sothich" value="bongda"><label for="da_bong">Đá bóng</label>
    <input type="checkbox" id="doc_sach" name="sothich" value="docsach"><label for="doc_sach">Đọc sách</label>
  </p>
  <textarea id="loinhan" rows="4" cols="40" placeholder="Nhập lời nhắn..."></textarea>
  <select id="tp">
    <option value="">-- Chọn tỉnh --</option>
    <option value="hcm">TP. Hồ Chí Minh</option>
    <option value="hn">Hà Nội</option>
  </select>
  <button type="submit">Đăng ký</button>
  <button type="reset">Nhập lại</button>
</form>
```

Phân biệt nhanh: **radio = hỏi 1 đáp án duy nhất, checkbox = cho phép nhiều**, textarea = textbox nhiều dòng, select = menu xổ xuống.

## 3. Thẻ ngữ nghĩa (semantic) — điểm cộng lớn khi chấm đồ án

Thay vì bọc cả trang bằng hàng chục `div` vô danh, HTML5 có thẻ "tự nói ra vai trò":

```
┌───────────── header ────────────┐
│ logo + h1                        │
├────────────── nav ──────────────┤
│ Trang chủ | Sản phẩm | Liên hệ   │
├─────────────────────────────────┤
│ main                             │
│ ┌── article ──┐  ┌── aside ──┐   │
│ │ bài viết    │  │ quảng cáo │   │
│ └─────────────┘  └───────────┘   │
├───────────── footer ────────────┤
│ bản quyền - liên hệ              │
└─────────────────────────────────┘
```

```html
<header>...</header>            <!-- phần đầu trang: logo, banner -->
<nav>...</nav>                   <!-- thanh điều hướng (navigation) -->
<main>Một trang CHỈ có 1 main</main>  <!-- nội dung chính -->
<section>Nhóm nội dung theo chủ đề</section>
<article>Bài viết độc lập: 1 bài blog, 1 sản phẩm</article>
<aside>Nội dung phụ bên cạnh</aside>
<footer>...</footer>             <!-- chân trang: copyright, link -->
```

Lợi ích: code dễ đọc hơn, SEO tốt hơn, người chấm đồ án nhìn là thấy chuyên nghiệp.

## 4. Media: audio, video, iframe

```html
<audio controls src="media/nhac.mp3"></audio>          <!-- controls: hiện nút play -->

<video controls width="480" src="media/quangcao.mp4"></video>

<iframe src="https://www.youtube.com/embed/MÃ_VIDEO"
        width="560" height="315" allowfullscreen></iframe> <!-- nhúng video YouTube -->
```

Chú ý với YouTube: link xem phim là `youtube.com/watch?v=XXX`, link nhúng phải là `youtube.com/embed/XXX` — lấy từ nút Share → Embed của YouTube.

## Checklist tự kiểm tra

- [ ] Nhớ đúng thứ tự 3 tầng table
- [ ] Giải thích được colspan vs rowspan
- [ ] Làm form có: text, email, password, radio, checkbox, textarea, select, button
- [ ] Biết vì sao radio phải chung name
- [ ] Dựng được khung semantic header/nav/main/footer
