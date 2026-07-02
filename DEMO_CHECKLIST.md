# Checklist Test Va Demo Cho Chu Quan

## Trang Thai Hien Tai

- Server local dang chay tai: `http://192.168.1.15:5173`
- May tinh mo duoc: `http://localhost:5173`
- App dang co 32 mon trong menu.
- Neu Chrome bao loi SSL, go lai dung `http://`, khong dung `https://`.

## Muc Tieu Demo

Chu quan can thay 4 dieu:

1. Nhan vien khong can nho order lau.
2. Order vao bep nhanh va ro rang.
3. Quan co the tu sua tu viet tat trong menu.
4. Doanh thu ngay duoc tinh tu order da gui, khong hien gia tren order bep.

## Chuan Bi Truoc Khi Test

- [ ] May tinh va dien thoai cung mot Wi-Fi.
- [ ] May tinh cam sac, khong de sleep.
- [ ] Dien thoai mo Chrome tai `http://192.168.1.15:5173`.
- [ ] May tinh mo tab `Bep`.
- [ ] Mot tab khac mo `Doanh thu`.
- [ ] Neu cot `Xong` co order cu, bam `Xoa mon xong` de don man hinh bep.
- [ ] Trong tab `Doanh thu`, chon ngay hom nay.

## Luu Y Ve Du Lieu Demo

Order test cung la order that trong app local, nen tab `Doanh thu` hom nay se cong ca order test.

Co 2 cach demo:

1. Demo bang du lieu test: noi ro voi chu quan day la du lieu demo.
2. Demo bang man hinh sach: truoc khi demo, backup va reset order demo.

Neu muon reset sach truoc demo, chi lam khi chac chan day chua phai du lieu ban hang that:

```powershell
Copy-Item shop-data.json shop-data.backup-before-demo.json
node -e "const fs=require('fs'); const p='shop-data.json'; const d=JSON.parse(fs.readFileSync(p,'utf8')); d.orders=[]; d.sequence=0; fs.writeFileSync(p, JSON.stringify(d,null,2)+'\n', 'utf8');"
```

Sau khi reset file, restart server:

```powershell
node server.js
```

## Test 1: App Co Chay Tren Dien Thoai Khong

- [ ] Dien thoai mo duoc app bang `http://192.168.1.15:5173`.
- [ ] Co 4 tab: `Nhan vien`, `Bep`, `Doanh thu`, `Menu`.
- [ ] Banner bao da dong bo voi may chu local.

Ket qua dung: dien thoai va may tinh cung thay order chung.

## Test 2: Tach Order Bang Cach Go Text

Trong tab `Nhan vien`, dan cau nay vao o noi dung:

```text
Ghi mon, hai sua nho ngot it da va mot tra vai
```

Bam `Tach mon`.

Can thay:

- [ ] `2 x Phin Sua Da`, size `S`, vi `ngot`, da `it da`.
- [ ] `1 x Tra Lai Vai`, size `M`, vi `vua`, da `vua`.
- [ ] Bam `Gui bep` thi order hien o tab `Bep`.
- [ ] Tab `Doanh thu` tang them `63.000d`.

## Test 3: Test Cac Cau Viet Tat Quan Hay Dung

Test tung cau, moi cau tach mon va kiem tra order nhap truoc khi gui:

```text
Ghi mon, den da khong duong
```

Dung khi ra:

- [ ] `Phin Den Da`, size `M`, vi `khong duong`, da `vua`.

```text
Ghi mon, dac thom it ngot nhieu da
```

Dung khi ra:

- [ ] `Tra Lai Dac Thom`, size `M`, vi `it ngot`, da `nhieu da`.

```text
Ghi mon, oolong chanh mat ong lon chua it da
```

Dung khi ra:

- [ ] `Oolong Chanh Mat Ong`, size `L`, vi `chua`, da `it da`.

```text
Ghi mon, mot sua nho mot tra lai
```

Dung khi ra:

- [ ] `1 x Phin Sua Da`, size `S`.
- [ ] `1 x Tra Lai Vai`, size `M`.

```text
Ghi mon, ca phe sua lon it ngot tra lai dac thom it ngot
```

Dung khi ra:

- [ ] Tach duoc 2 mon rieng du khong co tu `va`.
- [ ] `Phin Sua Da`, vi `it ngot`.
- [ ] `Tra Lai Dac Thom`, vi `it ngot`.

```text
Ghi mon, sua nho binh rieng
```

Dung khi ra:

- [ ] `Phin Sua Da`, size `S`.
- [ ] Co ghi chu `binh rieng`.

## Test 4: Test Giong Noi Tren Dien Thoai

Cach on dinh nhat la dung micro tren ban phim dien thoai:

- [ ] Cham vao o `Noi dung nghe duoc`.
- [ ] Bam icon micro tren ban phim.
- [ ] Noi: `Ghi mon, hai sua nho ngot it da va mot tra vai`.
- [ ] Dung mic, kiem tra text hien trong o.
- [ ] Bam `Tach mon`.
- [ ] Kiem tra order nhap.
- [ ] Bam `Gui bep`.

Neu mic trinh duyet khong chay, dung mic ban phim. Day la fallback chinh cho quan.

## Test 5: Sua Tu Nhan Dien Mon

Vi du them tu `nau da` cho `Phin Sua Da`:

- [ ] Vao tab `Menu`.
- [ ] Tim `Phin Sua Da`.
- [ ] Trong o `Tu nhan dien mon`, them `nau da`.
- [ ] Bam `Luu tu`.
- [ ] Quay ve tab `Nhan vien`.
- [ ] Thu: `Ghi mon, mot nau da`.

Dung khi ra:

- [ ] `1 x Phin Sua Da`.

## Test 6: Luong Bep

- [ ] Gui mot order moi.
- [ ] Tren tab `Bep`, order vao cot `Moi`.
- [ ] Bam `Dang lam`, order chuyen sang cot `Dang lam`.
- [ ] Bam `Sua`, order quay ve tab `Nhan vien`.
- [ ] Tang/giam/xoa mon trong order nhap.
- [ ] Xoa mot mon cu, noi/go mon moi, bam `Tach mon`.
- [ ] Mon moi duoc them vao order nhap va cac mon cu con lai van giu nguyen.
- [ ] Noi/go lai mot mon da co san, bam `Tach mon`.
- [ ] App khong them trung mon da co.
- [ ] Bam `Cap nhat order`.
- [ ] Order giu nguyen ma cu va quay lai cot `Moi`.
- [ ] The order co dong `Da sua`.
- [ ] Bam `Xong`, order chuyen sang cot `Xong`.
- [ ] Bam `Xoa mon xong`, order bien khoi bang bep.
- [ ] Qua tab `Doanh thu`, doanh thu van con.

Ket qua dung: don man hinh bep khong lam mat doanh thu.

## Test 7: Doanh Thu

- [ ] Chon ngay hom nay.
- [ ] Tong doanh thu dung voi order vua gui.
- [ ] So order tang dung.
- [ ] So ly dung tang dung, nhung khong tinh mon `binh rieng`.
- [ ] So ly size S, M, L tang dung.
- [ ] So `Binh rieng` tang dung.
- [ ] Danh sach mon da ban co ten mon, size, so luong, don gia va thanh tien.
- [ ] Mon `binh rieng` duoc tru `2.000d/ly`.
- [ ] Order trong tab `Bep` khong hien gia.

## Cac Loi Hay Gap Va Cach Xu Ly

### Dien thoai khong vao duoc app

1. Kiem tra dien thoai va may tinh cung Wi-Fi.
2. Go dung `http://192.168.1.15:5173`.
3. Neu Chrome tu doi sang HTTPS, xoa `https://` va go lai `http://`.
4. Neu Windows Firewall hoi Node.js, chon Allow tren Private network.

### App khong dong bo

1. Reload ca dien thoai va may tinh.
2. Kiem tra server con chay khong.
3. Chay lai server bang:

```powershell
node server.js
```

### Giong noi sai chu

1. Kiem tra text trong o truoc.
2. Neu app khong nhan ra mon, vao `Menu` them tu nhan dien moi.
3. Demo nen noi cham, tach cum ro: ten mon, size, vi, da.

### Doanh thu khong nhu mong doi

1. Kiem tra tab `Doanh thu` dang chon dung ngay.
2. Kiem tra order da bam `Gui bep` chua.
3. Luu y: order nhap chua gui bep se khong tinh doanh thu.

## Kich Ban Demo 7 Phut

### 1. Mo Dau: 30 Giay

Noi ngan gon:

```text
App nay giup nhan vien ghi order bang giong noi tieng Viet, gui thang sang bep,
va tu tong ket doanh thu trong ngay. Ban MVP nay chay local trong quan,
khong can internet va khong can tai khoan.
```

### 2. Show Luong Chinh: 2 Phut

1. Tren dien thoai mo tab `Nhan vien`.
2. Noi hoac go: `Ghi mon, hai sua nho ngot it da va mot tra vai`.
3. Bam `Tach mon`.
4. Chi cho chu quan thay order nhap co 3 cot: ten mon/size, vi, da.
5. Bam `Gui bep`.
6. Tren may tinh tab `Bep`, order moi xuat hien ngay.

Thong diep can noi:

```text
Nhan vien van duoc kiem tra truoc khi gui, nen app ho tro nhanh hon chu khong tu y gui sai.
```

### 3. Show Bep: 1 Phut

1. Bam `Dang lam`.
2. Bam `Xong`.
3. Bam `Xoa mon xong`.

Thong diep can noi:

```text
Bep co the don man hinh, nhung order khong bi xoa khoi doanh thu.
```

### 4. Show Doanh Thu: 1 Phut

1. Mo tab `Doanh thu`.
2. Chi tong doanh thu, so order, so ly/mon.
3. Chi breakdown mon da ban.

Thong diep can noi:

```text
Gia khong hien cho bep de man hinh gon, chi hien o trang tong ket cho quan ly.
```

### 5. Show Menu Tu Sua Duoc: 1 Phut

1. Mo tab `Menu`.
2. Tim `Phin Sua Da`.
3. Them mot tu viet tat, vi du `nau da`.
4. Bam `Luu tu`.
5. Quay lai order: `Ghi mon, mot nau da`.

Thong diep can noi:

```text
Quan co the tu day app cac cach goi mon that cua nhan vien, khong can sua code.
```

### 6. Dong Demo: 30 Giay

Noi ro gioi han MVP:

```text
Ban hien tai tap trung vao local use: ghi mon, gui bep, sua tu nhan dien,
va tong ket doanh thu. Chua lam thanh toan, ton kho, tai khoan nhan vien,
hay cloud sync. Neu dung thu on, cac phan do co the lam tiep.
```

## Dieu Khong Nen Hua Trong Demo

- Khong hua app hieu moi cau noi nhu AI tong quat.
- Khong hua thay POS/thanh toan ngay.
- Khong hua sync nhieu chi nhanh.
- Khong hua nhan giong noi 100% trong moi moi truong on.

Noi dung nen hua:

- Dung local trong quan.
- Menu co the tu them tu viet tat.
- Nhan vien co buoc kiem tra truoc khi gui.
- Bep thay order chung.
- Doanh thu ngay duoc tinh tu order da gui.
