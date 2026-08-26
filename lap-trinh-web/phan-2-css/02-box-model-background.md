# Bài 2.2 — Box model: mô hình HỘP của mọi phần tử

## 1. Ý tưởng cốt lõi

Trong mắt CSS, **mọi phần tử đều là một hộp chữ nhật**, gồm 4 lớp xếp nhau như ổ bánh:

```
┌──────────────── margin (khoảng cách với BÊN NGOÀI - trong suốt) ─────────┐
│  ┌────────────── border (viền) ────────────────────────────────────┐    │
│  │  ┌────────── padding (đệm bên TRONG - cùng màu nền) ─────────┐  │    │
│  │  │                                           ┌─────────┐     │  │    │
│  │  │          content: nội dung                │ margin  │     │  │    │
│  │  │          chữ, ảnh...                      │         │     │  │    │
│  │  │                                           └─────────┘     │  │    │
│  │  └─────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
   ↑ Mở DevTools → tab Elements → panel Styles, kéo xuống thấy hình vẽ này ngay!
```

**Câu đố kiểm tra hiểu bài:** Ô input nhìn "chật chội" — cần thêm không gian TRONG viền hay NGOÀI viền? Trả lời: trong viền → tăng `padding`. Hai khối dán vào nhau quá xấu — muốn tách ra → `margin`.

## 2. Cú pháp cả từng cạnh

```css
.the {
  /* Viết gộp: top right bottom left (chiều kim đồng hồ từ trên) */
  padding: 10px 20px 30px 40px;
  margin: 20px auto;      /* 2 giá trị = (dọc) (ngang); auto NGANG = căn giữa khối! */
  
  border: 2px solid #333; /* độ dày kiểu-màu */
  border-radius: 12px;    /* bo góc — dấu hiệu nhận diện UI hiện đại */
}
```

Các kiểu border: `solid` nét liền, `dashed` đứt, `dotted` chấm, `none`. 

Ba mẹo dùng cực kỳ thường xuyên:

```css
.khung {                       /* ký hiệu tay viết: chỉ lề trái phải khác nhau */
  margin: 0 auto;              /* công thức CĂN GIỮA một khối có width cố định */
  width: 600px;
}

.card {                        /* bo tròn hoàn toàn thành viên nhộng/ảnh tròn */
  border-radius: 999px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;          /* % = hình tròn khi vuông vắn */
}
```

⚠️ **Bẫy kinh điển:** tổng chiều rộng thật = content + padding + border. Khai `width: 300px; padding: 20px; border: 1px` thì hộp rộng tới **342px**, layout vỡ ót không rõ lý do.

Giải pháp chuẩn ngành — dán dòng này lên đầu mọi file css:

```css
* { box-sizing: border-box; }
/*Width tính theo trọn hộp (đã gồm padding + border) -> số khai báo bao nhiêu rộng đúng bấy nhiêu */
```

## 3. Margin collapse — hiện tượng lạ đáng biết

Hai khối chồng nhau dọc: margin-dưới của A và margin-trên của B **không cộng lại mà lấy cái lớn hơn** (A đáy cách 30px, B nóc cách 30px, khoảng hở chỉ 30px chứ không phải 60). Biết điều này để khỏi hoang mang khi khoảng cách "không đúng tính toán".

## 4. Display — phần tử trình diện thế nào

| Giá trị | Hành xử | Ví dụ thẻ mặc định |
|---|---|---|
| `block` | chiếm nguyên hàng ngang, đặt width/height được | div, p, h1 |
| `inline` | nằm liền cùng dòng, width/height VÔ ÍCH | span, a, strong |
| `inline-block` | nằm cùng dòng NHƯNG chỉnh kích thước được | img (mặc định gần giống) |
| `none` | biến mất hẳn khỏi trang | — |

Tình huống thực tế: hai nút muốn đứng cạnh nhau nhưng mỗi nút là `<a>` (inline → chỉnh padding-height bị trơ). Ép:

```css
.nut { display: inline-block; padding: 10px 24px; }
```

Ẩn/hiện khi bấm nút (JS sẽ dùng công thức này ở Phần 3):

```css
.menu-dong { display: none; }   /* JS toggles class này */
```

Khác biệt tinh tế: `visibility: hidden` cũng giấu nhưng **vẫn giữ chỗ trống**, còn `display:none` rút luôn chỗ.

## 5. Background — nền

```css
.banner {
  background-color: #ffd;
  background-image: url("images/bg.jpg");
  background-size: cover;       /* phủ kín vùng, giữ tỷ lệ - KHÔNG méo */
  background-position: center;  /* canh giữa tấm ảnh */
  background-repeat: no-repeat;

  /* Gradient - màu chuyển sắc, đẹp nhanh mà không cần file ảnh */
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.overlay { background-color: rgba(0, 0, 0, 0.55); } /* màn che đen mờ 55% */

.gach-chan-hai-lop {
  box-shadow: 0 4px 8px rgba(0,0,0,.15);
  /*                 x y độ-loang màu  - bóng nổi của card/nguyên liệu button */
}
```

Hiệu ứng "thẻ nổi" kiểu shopee: nền trắng + radius + shadow nhẹ; hover nâng lên:

```css
.card { transition: transform .2s, box-shadow .2s; }
.card:hover { transform: translateY(-6px); box-shadow: 0 12px 20px rgba(0,0,0,.25); }
```

## Checklist tự kiểm tra

- [ ] Vẽ được 4 lớp box model theo thứ tự từ trong ra ngoài
- [ ] Giải thích box-sizing: border-box giải quyết vấn đề gì
- [ ] Tạo khối 400px tự căn giữa bằng margin auto
- [ ] Phân biệt display none vs visibility hidden vs opacity 0
- [ ] Làm được card bo góc đổ bóng, hover nhấc lên
