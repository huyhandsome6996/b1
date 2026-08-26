# Bài 3.1 — JavaScript căn bản: biến, kiểu dữ liệu, toán tử

## 1. JS là gì và chèn vào trang bằng cách nào?

JavaScript = ngôn ngữ LẬP TRÌNH duy nhất trình duyệt hiểu sẵn. Nó đọc thao tác từng phần tử HTML, đổi nội dung, kiểm tra form, tính toán, gọi dữ liệu...

Ba cách nhúng (giống CSS):

```html
<!-- 1. INLINE - gắn trực tiếp thẻ - hạn chế -->
<button onclick="alert('Xin chao!')">Bấm thử</button>

<!-- 2. INTERNAL - viết trong script đặt trước </body> -->
<script>
  console.log("Xin chào từ JS!");
</script>

<!-- 3. EXTERNAL - file riêng, CHUẨN ĐỒ ÁN; defer giúp chờ HTML dựng xong mới chạy -->
<script src="js/script.js" defer></script>
```

Vị trí đặt `<script>`: cuối body hoặc có `defer` — vì JS cần các phần tử đã tồn tại rồi mới "tóm" được chúng.

## 2. In ra để xem kết quả — hai người bạn đầu tiên

```js
console.log("Dòng này hiện trong F12 > Console");   // gỡ lỗi chuyên nghiệp
alert("Cửa sổ thông báo giữa màn hình");            // bắt mắt nhưng gây khó chịu
```

Ghi chú một dòng dùng `//`, ghi chú nhiều dòng `/* ... */`. Tập quen comment TRƯỚC MỖI KHỐI LOGIC — giảng viên chấm code rất thích.

## 3. Biến — cái hộp dán nhãn chứa giá trị

```js
let tuoi = 18;              // let: giá trị SẼ THAY ĐỔI được
const ten = "Minh An";      // const: chỉ gán 1 lần - MẶC ĐỊNH LUÔN DÙNG CONST
tuoi = 19;                  // OK với let
// ten = "Ai đó";           // LỖI! const không cho gán lại
```

Quy tắc đặt tên biến: bắt đầu chữ/`_`/`$`, không dấu cách, **phân biệt hoa thường** (`Tuoi` khác `tuoi`), tự miêu tả (`diemToan` hơn là `x`). Kiểu camelCase: chữ sau viết in hoa.

## 4. Kiểu dữ liệu nền tảng

```js
const ten    = "An";        // string: chuỗi ký tự trong ngoặc '...' "..." `...`
const nam    = 2026;        // number: bao gồm cả số lẻ 9.5
const daHoc  = true;        // boolean: chỉ true/false
let chuaCo;                 // undefined: khai báo rồi nhưng chưa gán gì
const homSau = null;        // null: cố ý để "trống rỗng"

typeof ten      // trả về "string" - kiểm tra kiểu khi nghi ngờ
```

### Template literal — ghép chuỗi sang tay bẩm sinh

```js
const diem = 10;
console.log("Bạn " + ten + " được " + diem + " điểm");   // cách cũ loạn mắt dấu +
console.log(`Bạn ${ten} được ${diem} điểm`);              // NHỎ GỌN - dùng cặp backtick `
```

`${...}` chèn bất kỳ biểu thức vào ngay: `${diem >= 5 ? "Đỗ" : "Trượt"}`.

## 5. Toán tử

```js
// Số học: + - * / % % lấy phần dư (chẵn/lẻ dùng khắp nơi)
17 % 5          // 2
i % 2 === 0     // đúng nếu i chẵn

// Gán mở rộng: += -= *= /=
diem += 1       // tương đương diem = diem + 1

// So sánh
3 == "3"        // true  : SO SÁNH LOẠI hình (chuyển đổi ẩn) - NGUY HIỂM
3 === "3"       // false : so sánh CẢ KIỂU - hãy dùng === và !== mọi lúc!

// Logic
diem >= 8 && chuyenCan > 90   // && : VÀ - cả hai cùng đúng
laCuoiTuan || laLe            // || : HOẶC - chỉ cần một đúng
!daDongY                       // !  : PHỦ ĐỊNH
```

Ép kiểu khi cần: `Number("18")` → 18, `String(2026)` → "2026". Đặc biệt nhớ: dữ liệu từ form/input LUÔN là chữ `"5"`, muốn tính toán phải `Number(...)` chuyển trước.

## 6. Nhập liệu nhanh bằng prompt (để luyện tập)

```js
const hoTen = prompt("Tên bạn là gì?");     // hộp nhập, giá trị luôn là CHUỖI
const namSinh = Number(prompt("Sinh năm?"));
const tuoi = 2026 - namSinh;
console.log(`${hoTen} năm nay ${tuoi} tuổi.`);
```

## 7. Thuật toán quy đổi bài toán đời sống → code

**Bài tập mẫu:** tính điểm trung bình 3 môn rồi xếp loại.

```js
const toan = Number(prompt("Điểm Toán:"));
const van  = Number(prompt("Điểm Văn:"));
const anh  = Number(prompt("Điểm Anh:"));

const dtb = (toan + van + anh) / 3;
console.log(`DTB: ${dtb.toFixed(1)}`);   // toFixed(1): giữ 1 số lẻ

if (dtb >= 8) console.log("Giỏi");
else if (dtb >= 6.5) console.log("Khá");
else console.log("Cần cố gắng");         // if else dạy kỹ ở bài sau
```

## Checklist tự kiểm tra

- [ ] Giải thích vì sao nên mặc định dùng const
- [ ] Liệt kê 4 kiểu cơ bản + typeof dùng thế nào
- [ ] Viết template literal đúng cú pháp backtick
- [ ] Trả lời tức thì: `==` hay `===`? Và lý do
- [ ] Biết input của prompt/form là chuỗi cần Number()
