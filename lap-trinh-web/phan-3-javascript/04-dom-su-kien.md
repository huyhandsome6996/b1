# Bài 3.4 — DOM & Events: biến HTML thành sân khấu của JS

Đây là bài **mấu chốt** để website "sống": JS tóm lấy phần tử HTML, đổi nội dung, nghe hành động người dùng.

## 1. DOM là gì?

**DOM (Document Object Model):** trình duyệt đọc file HTML và dựng thành CÂY đối tượng trong bộ nhớ. JS chỉ có thể can thiệp web qua cây này:

```
document
└── html
    ├── head ── title, meta...
    └── body
        ├── h1
        ├── ul.menu ── li, li, li     <-- mỗi ô vuông = 1 node/đối tượng JS điều khiển được
        └── form
            ├── input#ten
            └── button
```

## 2. Tìm phần tử — bước đầu mọi kịch bản

```js
// Theo id - CHÍNH XÁC NHẤT, mỗi id một chỗ
const nut = document.getElementById("nutGui");

// Theo CSS selector - MỖI PHÁP đa năng, dùng quen nhất ngày nay
const tieuDe = document.querySelector("h1");           // phần tử ĐẦU TIÊN khớp
const dsSp   = document.querySelectorAll(".san-pham"); // TẤT CẢ phần tử khớp -> NodeLIst
dsSp.forEach(sp => console.log(sp.textContent));
```

Quy tắc chọn: có `id` thì dùng `getElementById`; còn lại dùng `querySelector` với đúng cú pháp CSS (`".lop"`, `"#id"`, `"nav a"`). Viết thiếu dấu chấm/hô trước class/id là lỗi não nhất tuần đầu DOM — Console sẽ báo `null`.

## 3. Thay đổi nội dung và thuộc tính

```js
const td = document.getElementById("tieu-de");

td.textContent = "Chào buổi sáng!";        // thay chữ THUẦN (an toàn)
td.innerHTML = "Chào <strong>buổi sáng</strong>"; // chèn luôn HTML - cẩn thận dữ liệu lạ!

const anh = document.querySelector(".avatar");
anh.src = "images/an-moi.jpg";             // đổi thuộc tính: .src .href .value...
anh.style.borderRadius = "50%";            // style camelCase, không gạch ngang

// Can thiệp lớp CSS - TUYỆT VỐN vì toàn bộ giao diện nằm sẵn trong file css rồi
const the = document.getElementById("the");
the.classList.add("active");       // thêm class
the.classList.remove("dang");      // bỏ
the.classList.toggle("dark-mode"); // có thì bỏ, không thì thêm -> công thức dark mode!
```

Đây chính lý do bài 2.4 dạy bạn viết sẵn class `.dark { ... }` — JS chỉ việc bật/tắt, không loay hoay sửa từng thuộc tính màu.

## 4. Sự kiện — phản ứng theo người dùng

```html
<button id="like">Thích</button>
<p id="dem">0 lượt thích</p>
```

```js
let soLuot = 0;
const btnLike = document.getElementById("like");
const chuDem  = document.getElementById("dem");

btnLike.addEventListener("click", function () {
  soLuot++;                                       // logic nghiệp vụ
  chuDem.textContent = `${soLuot} lượt thích`;    // cập nhật lại màn hình
});
// arrow function cũng ok: btnLike.addEventListener("click", () => { ... });
```

Công thức cần thuộc như bảng cửu chương:

> **chọn phần tử → addEventListener(tên-sự-kiện, hàm-xử-lý) → bên trong đổi nội dung/style/class**

Sự kiện thông dụng:

| Sự kiện | Bắn ra khi |
|---|---|
| `click` | bấm vào phần tử |
| `input` | gõ/mỗi ký tự thay đổi giá trị (live) |
| `change` | giá trị XÁC NHẬN xong (chọn select xong, blur checkbox...) |
| `submit` | nhấn nút submit / Enter trong form |
| `keydown` | phím đang nhấn |
| `DOMContentLoaded` | HTML tải xong — đặt code khởi tạo ở đây |

## 5. Đọc + ghi input, chặn submit reload trang

Bài toán vĩnh cửu của mọi form:

```html
<form id="fDangKy">
  <input type="text" id="hoTen">
  <button type="submit">Gửi</button>
</form>
<p id="bao"></p>
```

```js
const f = document.getElementById("fDangKy");
const oTen = document.getElementById("hoTen");
const pBao = document.getElementById("bao");

f.addEventListener("submit", function (e) {
  e.preventDefault();   // CHẶN trình duyệt tự tải lại trang - KHÔNG THIẾU ĐƯỢC

  const ten = oTen.value.trim();      // .value đọc nội dung ô nhập; trim cắt khoảng trắng 2 đầu

  if (ten.length < 2) {
    pBao.textContent = "Tên quá ngắn!";
    pBao.style.color = "red";
    return;                            // dừng, không chạy tiếp bước dưới
  }
  pBao.textContent = `Xin chào ${ten}!`;
  pBao.style.color = "green";
});
```

Chuỗi xử lý chuẩn validate luôn gồm: chặn mặc định → đọc value → kiểm tra điều kiện → báo lỗi hoặc cho qua.

## 6. Tạo và xoá phần tử tại runtime — render danh sách từ mảng

Mẫu render này xuất hiện ở 100% đồ án có danh sách sản phẩm/công việc:

```js
const cvList = ["Học HTML", "Học CSS"];
const ul = document.querySelector("#danh-sach");

function hienThi() {
  ul.innerHTML = "";                          // xoá sạch trước khi vẽ lại
  for (const cv of cvList) {
    const li = document.createElement("li");  // nặn thẻ mới
    li.textContent = cv;
    const btnXoa = document.createElement("button");
    btnXoa.textContent = "x";
    btnXoa.onclick = () => {
      const i = cvList.indexOf(cv);
      cvList.splice(i, 1);                    // bỏ khỏi mảng
      hienThi();                              // vẽ lại danh sách
    };
    li.append(btnXoa);                        // ghép con vào
    ul.append(li);
  }
}
hienThi();

document.querySelector("#them").addEventListener("click", () => {
  const oNhap = document.querySelector("#cv-moi");
  if (oNhap.value.trim() === "") return;      // rỗng thì thôi
  cvList.push(oNhap.value.trim());
  oNhap.value = "";
  hienThi();
});
```

Mô hình *data → render*: chỉnh dữ liệu (push/splice), gọi hàm vẽ lại — đỡ phải tự tay đổi từng dòng HTML.

## Checklist tự kiểm tra

- [ ] Viết đúng `addEventListener("click", ...)`
- [ ] Phân biệt textContent vs innerHTML
- [ ] Giải thích preventDefault chặn cái gì, bỏ nó thì sao
- [ ] Làm nút toggle dark mode bằng classList.toggle
- [ ] Kể được mô hình data -> render và vì sao phải xoá trước khi vẽ
