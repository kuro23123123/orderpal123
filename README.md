# Ghi Món Bằng Giọng Nói

MVP local cho quán cà phê: nhân viên nói món bằng tiếng Việt, app tách món theo menu, nhân viên kiểm tra rồi gửi sang màn hình bếp/quầy pha chế.

## App Làm Gì

- Nhân viên nói hoặc nhập: `Ghi món, hai phin sữa đá ngọt ít đá và một cafe muối chua nhiều đá`.
- App nhận món tiếng Việt, có dấu hoặc không dấu.
- App chỉ khớp với món có trong menu.
- Nhân viên kiểm tra order nháp.
- Bếp/quầy pha chế thấy order trong danh sách chung.
- Tab `Doanh thu` cộng tiền theo order đã gửi trong ngày, dựa trên giá trong ảnh menu.
- Bếp sắp xếp order từ mã nhỏ đến mã lớn để người tới trước được làm trước.

## Chạy Local Cho Điện Thoại

Từ thư mục này:

```powershell
node server.js
```

Hoặc double-click:

```text
start-shop.bat
```

Giữ cửa sổ server mở trong lúc dùng.

Trên máy tính, mở:

```text
http://localhost:5173
```

Trên điện thoại, kết nối cùng Wi-Fi với máy tính rồi mở URL local, ví dụ:

```text
http://192.168.1.20:5173
```

Nhớ gõ đủ `http://`. Nếu Chrome báo `ERR_SSL_PROTOCOL_ERROR`, nghĩa là nó đang ép sang `https://`; sửa lại thành `http://`.

Nếu Windows Firewall hỏi, cho phép Node.js trên mạng private/local.

## Chạy Cloud Không Cần Laptop

Nếu muốn điện thoại và bếp dùng cùng một link HTTPS mà không cần laptop chạy server, deploy app lên cloud.

Xem hướng dẫn chi tiết trong:

```text
CLOUD_DEPLOY.md
```

App đã có sẵn `package.json` và `render.yaml` để deploy lên Render.

## Test Nhanh

1. Máy tính mở tab `Bếp`.
2. Điện thoại mở tab `Nhân viên`.
3. Chạm vào ô `Nội dung nghe được`.
4. Dùng micro bàn phím điện thoại hoặc gõ:

```text
Ghi món, hai phin sữa đá ngọt ít đá và một cafe muối chua nhiều đá
```

5. Bấm `Tách món`.
6. Kiểm tra order nháp.
7. Điền `Tên khách / bàn`, ví dụ `Bàn 2`.
8. Bấm `Gửi bếp`.
9. Nhìn màn hình `Bếp`; order mới sẽ hiện trong cột `Mới`.
10. Mở tab `Doanh thu`; tổng tiền ngày hôm đó sẽ tự cập nhật.

Giá tiền không hiện trên order của nhân viên hoặc bếp. Giá chỉ hiện trong tab `Doanh thu`.

## Ghi Chú Về Nhập Order Trên Điện Thoại

Màn `Nhân viên` hiện ưu tiên nhập văn bản để demo ổn định:

1. Chạm vào ô nhập.
2. Gõ order hoặc dùng micro của bàn phím điện thoại.
3. Kiểm tra text trong ô.
4. Bấm `Tách món`.

Nếu khách dùng bình cá nhân, nói thêm một trong các cụm:

```text
bình riêng, bình cá nhân, đựng trong bình, vô trong bình, trong bình
```

App sẽ ghi chú `bình riêng`, trừ `2.000đ` trong doanh thu, và không tính món đó vào số ly S/M/L đã sử dụng.

## Khởi Động Bằng VS Code

1. Mở VS Code.
2. Vào `File` -> `Open Folder...`.
3. Chọn thư mục:

```text
C:\Users\ACER\Documents\Codex\2026-06-26\brainstorm-an-app-for-bnb-business
```

4. Mở Terminal trong VS Code bằng `Terminal` -> `New Terminal`.
5. Chạy:

```powershell
node server.js
```

6. Giữ terminal đó mở trong lúc dùng app.
7. Trên máy tính mở `http://localhost:5173`.
8. Trên điện thoại cùng Wi-Fi mở URL mà terminal in ra, ví dụ `http://192.168.1.15:5173`.

Muốn tắt server, quay lại terminal đang chạy server và bấm `Ctrl + C`.

## Thêm Từ Viết Tắt Cho Món

1. Mở tab `Menu`.
2. Tìm món cần sửa.
3. Trong ô `Từ nhận diện món`, thêm từ viết tắt hoặc tên gọi khác.
4. Ngăn cách nhiều từ bằng dấu phẩy hoặc xuống dòng.
5. Bấm `Lưu từ`.

Ví dụ với `Phin Sữa Đá`, có thể thêm:

```text
sữa, nâu đá, cf sữa
```

## Sửa Order Khi Khách Đổi Món

1. Mở tab `Bếp`.
2. Tìm order cần sửa.
3. Bấm `Sửa`.
4. App sẽ đưa order đó về tab `Nhân viên` dưới dạng order nháp.
5. Sửa số lượng bằng nút `+`, `-`, hoặc `xóa món`.
6. Nếu khách đổi một món, xóa món cũ rồi nhập/nói món mới và bấm `Tách món`.
7. Kiểm tra lại order nháp.
8. Bấm `Cập nhật order`.

Order giữ nguyên mã cũ, ví dụ `ORD-0004`, và quay lại cột `Mới` để bếp thấy thay đổi.

Khi đang sửa order, món mới được thêm vào order nháp hiện tại. Nếu nói lại một món đã có trong order, app sẽ bỏ qua để không thêm trùng.

## Dữ Liệu Local

Menu và order được lưu trên máy tính trong:

```text
shop-data.json
```

Không cần cloud, tài khoản, payment, inventory, hay internet.

Nút `Xóa món xong` chỉ ẩn order đã xong khỏi bảng bếp. Dữ liệu vẫn được giữ lại để tính doanh thu trong ngày.
