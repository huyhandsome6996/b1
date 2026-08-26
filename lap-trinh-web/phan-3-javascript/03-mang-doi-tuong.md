# Bài 3.3 — Mảng (array) và Đối tượng (object)

## 1. Mảng — một biến chứa một danh sách

```js
const monAn = ["Phở", "Bún bò", "Cơm gà"];
//                0       1        2      <-- CHỈ SỐ bắt đầu từ 0, luôn nhớ!

monAn.length              // 3 - độ dài
monAn[0]                  // "Phở" - phần tử đầu
monAn[monAn.length - 1]   // "Cơm gà" - công thức phần tử CUỐI
monAn[1] = "Hủ tiếu";     // sửa giá trị tại vị trí bất kỳ
```

Các phương thức thay đổi mảng phải thuộc:

```js
monAn.push("Bánh xèo");     // thêm CUỐI -> length tăng lên 4
monAn.pop();                // bỏ phần tử CUỐI và trả nó về cho bạn
monAn.shift();              // bỏ phần tử ĐẦU
monAn.unshift("Cháo");      // thêm ĐẦU

monAn.indexOf("Cơm gà")     // tìm chỉ số; không có trả -1
monAn.includes("Phở")       // true/false - hỏi có tồn tại không
```

### Duyệt mảng — hai cách cơ bản

```js
const diem = [8, 9, 6];

// Cách 1: for thường - khi CẦN biết index
for (let i = 0; i < diem.length; i++) {
  console.log(`Môn ${i + 1}: ${diem[i]} điểm`);
}

// Cách 2: for...of - chỉ cần giá trị từng phần tử
let tong = 0;
for (const d of diem) tong += d;
console.log(`Tổng: ${tong}`);   // 23
```

## 2. Các hàm xử lý mảng cấp cao (điểm cộng lớn khi demo đồ án)

Ba hàm này nhận vào **một hàm con** (thường viết arrow function) — nghe rối nhưng ví dụ nói hết:

```js
const gia = [100, 250, 400];

// map: BIẾN ĐỔI từng phần tử -> mảng MỚI cùng độ dài
const giaUSD = gia.map(g => g / 25000);          // [0.004, 0.01, 0.016]

// filter: LỌC giữ lại ai thỏa điều kiện
const re = gia.filter(g => g < 200);             // [100]

// find: về phần tử ĐẦU TIÊN thỏa điều kiện (không thì undefined)
const nhuY = gia.find(g => g > 150);             // 250

// forEach: chỉ duyệt, KHÔNG tạo mảng mới (giống for...of nhưng kiểu hàm)
gia.forEach((g, i) => console.log(`${i}: ${g}đ`));
```

Hình dung vỉa hè: `map` = mỗi lớp học được phát đồng phục mới (số người giữ nguyên); `filter` = giáo viên lọc lớp còn người cao dưới 1m65... À nhầm, giữ lại người CAO HƠN 1m65; `find` = gọi thằng đầu tiên mắt cận ra làm nhiệm vụ.

## 3. Object — mô tả MỘT THỰC THỂ bằng nhiều thuộc tính

Thay vì 5 biến rời rạc về một sinh viên, gói chung:

```js
const sinhVien = {
  ten: "Nguyễn Minh An",       // key: value
  tuoi: 18,
  chuyenNganh: "CNTT",
  "diem trung binh": 8.6       // key có dấu cách cần ngoặc kép
};

sinhVien.ten                    // đọc: "Nguyễn Minh An"
sinhVien.tuoi = 19;             // sửa
sinhVien.email = "an@st.edu";   // THÊM thuộc tính mới cũng chỉ vậy thôi
delete sinhVien.chuyenNganh;    // xóa
"tuoi" in sinhVien              // kiểm tra tồn tại key -> true

// key có dấu cách phải truy cập bằng dấu ngoặc vuông
sinhVien["diem trung binh"]     // 8.6
```

Object lồng nhau + chứa mảng:

```js
const truog = {
  ten: "ĐH Công nghệ",
  diaChi: { thanhPho: "TP.HCM", quan: "Quận 9" },   // object trong object
  khoaHoc: ["Web", "Mobile", "AI"]                   // mảng trong object
};
truog.diaChi.thanhPho           // đi từng tầng bằng dấu chấm
truog.khoaHoc[1]                // "Mobile"
```

## 4. Mảng chứa object — cấu trúc QUAN TRỌNG NHẤT của đồ án

Danh sách sản phẩm/sinh viên/bài viết trong website của bạn chính là dạng này:

```js
const sanPhams = [
  { id: 1, ten: "Áo thun",   gia: 150000, tonKho: 30 },
  { id: 2, ten: "Quần jean", gia: 450000, tonKho: 12 },
  { id: 3, ten: "Mũ lưỡi trai", gia: 99000, tonKho: 0 }
];

// Tổng tiền hàng tồn kho: kết hợp for + dot notation
let tongTien = 0;
for (const sp of sanPhams) tongTien += sp.gia * sp.tonKho;
console.log(tongTien);            // 9900000

// Lọc sản phẩm còn bán + gắn nhãn bằng chuỗi phương thức
const conHang = sanPhams.filter(sp => sp.tonKho > 0)
                         .map(sp => `${sp.ten} - ${sp.gia.toLocaleString("vi-VN")}đ`);
// ["Áo thun - 150.000đ", "Quần jean - 450.000đ"]
```

Trong tương lai khi học backend/API, dữ liệu server gửi về đúng định dạng này tên gọi **JSON**. Nắm chắc cấu trúc ở đây là đi trước nửa đường.

## 5. Hai hàm tiện dụng cuối

```js
JSON.stringify(sinhVien)          // object -> chuỗi JSON (lưu localStorage chẳng hạn)
JSON.parse('{"ten":"An"}')         // chuỗi JSON -> object dùng được

Math.max(...sanPhams.map(s => s.gia))  // ...spread bung mảng thành đối số riêng lẻ
```

## Checklist tự kiểm tra

- [ ] Trả lời tức thì: chỉ số mảng bắt đầu từ mấy? Phần tử cuối lấy thế nào?
- [ ] Phân biệt push/pop/shift/unshift
- [ ] Viết filter giữ số chẵn từ một mảng số
- [ ] Tạo object bản thân gồm 5 thông tin và in từng cái
- [ ] Suy nghĩ được: để đếm sản phẩm giá > 100k, dùng hàm nào là ngắn nhất?
