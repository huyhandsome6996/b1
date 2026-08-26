# Bài 2.3 — Dàn trang: Flexbox, Grid, Position

Đây là bài QUYẾT ĐỊNH một website đẹp hay xấu. Thuộc bài này là có khả năng dựng lại bất kỳ giao diện nào nhìn thấy.

## 1. Flexbox — xếp hàng dọc/ngang siêu linh hoạt

Kích hoạt chế độ flex: phần tử cha thêm `display:flex`, các con tự thành "hàng hóa" trên trục chính.

```css
.bo {
  display: flex;
  flex-direction: row;      /* row = nằm ngang (mặc định); column = dọc */
  justify-content: space-between; /* ĐỐI XỬ theo TRỤC CHÍNH */
  align-items: center;            /* ĐỐI XỬ theo TRỤC NGANG */
  gap: 16px;                      /* khoảng hở giữa các con - hiện đại, khỏi cần margin */
  flex-wrap: wrap;                /* hết chỗ thì xuống dòng thay vì ép méo */
}
```

### Bảng giá trị `justify-content` — học bằng hình

```text
flex-start        center           space-between     space-evenly
|[A][B][C]    |  |  [A][B][C]   | |[A]     [B] [C]| | [A]  [B]  [C] |
ép về trái       căn giữa          trái giữa phải    chia đều cả hai mép
```

Năm câu thần chú dựng bố cục quen thuộc:

| Mục tiêu | Công thức |
|---|---|
| Navbar: logo trái, menu phải | `display:flex; justify-content:space-between; align-items:center` |
| Căn giữa tuyệt đối một hộp trong khung | cha `display:flex; justify-content:center; align-items:center; min-height:100vh` |
| Hàng card cách đều nhau, co giãn | `display:flex; gap:20px` + mỗi con `flex:1` |
| Nhiều mục cuộn ngang kiểu story | `display:flex; overflow-x:auto` |
| Cột dọc form canh giữa chữ trái | `display:flex; flex-direction:column; gap:12px` |

Thuộc tính của **con**:

```css
.con { flex: 1; }        /* phân bổ đều chỗ trống - mỗi thằng một khoản như nhau */
.con-noi-bat { flex: 2; } /* thằng này gấp đôi phần của bạn nó */
```

## 2. Grid — lưới bảng cát-xét cho layout phức tạp

Khi flexbox là 1 chiều (ngang HOẶC dọc), grid quản lý **2 chiều** cùng lúc:

```css
.gian-hang {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 cột bằng nhau; fr = đơn vị miễn phí tỷ lệ */
  gap: 20px;
}

.khung-chinh {
  display: grid;
  grid-template-columns: 250px 1fr;       /* sidebar cố định + nội dung hút nốt phần còn lại */
  grid-template-rows: auto 1fr auto;      /* header... nội dung... footer */
}
```

Quyết định dùng cái nào? Quy ước ngành: **flexbox cho thanh/row đơn lẻ và nhóm nhỏ; grid cho mặt sàn tổng thể trang/vùng sản phẩm.** Thực tế đồ án hay pha trộn: page = grid, navbar bên trong = flex.

Media query chỉnh số cột theo màn hình (xem kỹ ở bài 2.4):

```css
@media (max-width: 768px) { .gian-hang { grid-template-columns: repeat(1, 1fr); } }
```

## 3. Position — định vị đè lên nhau

| Giá trị | Hành xử |
|---|---|
| `static` | mặc định, bỏ qua top/left/right/bottom |
| `relative` | đứng yên như thường, nhưng trở thành "mốc tọa độ" cho con |
| `absolute` | bay ra khỏi luồng, neo vào tổ tiên GẦN NHẤT có position khác static |
| `fixed` | dính chặt viewport, cuộn trang không trôi — menu dính đầu trang, nút chat |
| `sticky` | lai: cuộn tới đâu "dính" đến đó |

Combo kinh điển số 1 — huy hiệu đỏ đỉnh icon giỏ hàng:

```html
<div class="gio">
  🛒 <span class="badge">3</span>
</div>
```

```css
.gio { position: relative; }             /* cha làm mốc */
.badge {
  position: absolute;
  top: -8px; right: -10px;               /* đè lên góc, lòi ra ngoài chút cho xinh */
  background: red; color: white;
  border-radius: 50%;
  width: 20px; height: 20px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px;
}
```

Navbar dính trên đầu mọi lúc:

```css
nav {
  position: sticky; top: 0;
  background: white; z-index: 100;  /* z-index: thứ tự TẦNG - to đè lên thằng ít điểm */
}
```

## 4. Quy trình dựng một layout từ giấy trắng — làm theo để thành bản năng

Bài toán: header + nội dung 2 cột + footer.

```html
<body>
  <header>Đầu trang</header>
  <div class="wrapper">
    <aside>Menu</aside>
    <main>Nội dung</main>
  </div>
  <footer>Chân trang</footer>
</body>
```

```css
* { box-sizing: border-box; margin: 0; }
.wrapper { display: grid; grid-template-columns: 220px 1fr; }
main { padding: 24px; }
@media (max-width: 700px) { .wrapper { grid-template-columns: 1fr; } }  /* mobile: xếp chồng */
```

5 dòng CSS sườn — đáp án cho 90% đề dựng layout thi giữa kỳ. Phần còn lại chỉ là trang trí chi tiết.

## Checklist tự kiểm tra

- [ ] justify-content chạy theo trục nào, align-items chạy theo trục nào
- [ ] Viết CSS để logo bên trái, menu bên phải trong cùng một navbar
- [ ] Phân biệt khi nào dùng flexbox, khi nào dùng grid
- [ ] Làm được badge-red đè góc avatar (relative + absolute)
- [ ] Làm navbar fixed/sticky không bị nội dung đè xuyên qua
