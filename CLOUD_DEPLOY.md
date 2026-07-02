# Deploy Cloud Cho Quán

Mục tiêu: điện thoại nhân viên và màn hình bếp mở cùng một link HTTPS, không cần laptop chạy `node server.js`.

## Cách khuyến nghị: Render

App đã có sẵn:

- `package.json`: lệnh chạy cloud là `npm start`.
- `render.yaml`: cấu hình web service, HTTPS, health check, và ổ lưu dữ liệu `/var/data/shop-data.json`.
- `server.js`: đọc `PORT` của hosting và lưu dữ liệu theo `SHOP_DATA_FILE`.

## Bước 1: Đưa code lên GitHub

1. Tạo một repository mới trên GitHub.
2. Upload toàn bộ thư mục app này lên repo đó.
3. Đảm bảo repo có các file:
   - `server.js`
   - `app.js`
   - `index.html`
   - `styles.css`
   - `package.json`
   - `render.yaml`

## Bước 2: Tạo service trên Render

1. Vào Render và đăng nhập.
2. Tạo `New` -> `Blueprint`.
3. Chọn GitHub repo của app.
4. Render sẽ đọc `render.yaml`.
5. Deploy service.

Nếu Render không dùng Blueprint, tạo `Web Service` thủ công:

- Runtime: `Node`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`
- Environment variable:

```text
SHOP_DATA_FILE=/var/data/shop-data.json
NODE_ENV=production
```

- Disk:

```text
Mount path: /var/data
Size: 1 GB
```

## Bước 3: Mở app

Sau khi deploy xong, Render sẽ cho link dạng:

```text
https://ten-app.onrender.com
```

Dùng link đó cho:

- Điện thoại nhân viên: tab `Nhân viên`
- Máy bếp/quầy: tab `Bếp`
- Chủ quán: tab `Doanh thu`

## Test Sau Khi Deploy

1. Mở link HTTPS trên điện thoại.
2. Vào `Nhân viên`.
3. Bấm `Nói món`.
4. Cho phép microphone.
5. Nói:

```text
cacao sữa đá lớn
```

Kết quả đúng:

- Order nháp có `Cacao Sữa Đá`
- Size là `M`

6. Bấm `Gửi bếp`.
7. Mở link đó trên thiết bị khác, tab `Bếp`.
8. Order phải hiện trong cột `Mới`.
9. Mở `Doanh thu`, chọn đúng ngày bán, kiểm tra tổng tiền.

## Lưu Ý Quan Trọng

- Dùng cloud thì không cần laptop làm server.
- Mic trực tiếp ổn hơn vì link cloud là HTTPS.
- Nếu không gắn disk/persistent storage, dữ liệu order có thể mất khi service restart.
- Với Render, disk thường cần plan trả phí. Nếu chỉ demo nhanh, có thể bỏ disk, nhưng không nên dùng thật ở quán.
