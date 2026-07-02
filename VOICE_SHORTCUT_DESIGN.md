# Thiet Ke Ngon Ngu Order Bang Giong Noi

Muc tieu: nhan vien co the noi order that ngan, that deu, va app chi can nghe mot bo tu co dinh cua quan.

Khong huong toi viec AI hieu moi kieu noi tu nhien. Huong dung la tao "ngon ngu order rieng" cho Tram Cafe.

## Nguyen Tac

1. Moi mon nen co 1 tu goi chinh that ngan.
2. Moi mon chi nen co 1-3 tu viet tat duoc phe duyet.
3. Khong dung 2 tu nghe gan giong nhau cho 2 mon khac nhau.
4. Nhan vien noi theo thu tu co dinh: `so luong -> mon -> size -> vi -> da -> binh rieng`.
5. Neu khong noi so luong, app mac dinh la 1 ly.
6. Neu AI nghe qua nhieu tu la, order phai hien `khong nghe ro`, khong tu gui bep.

## Cau Truc Cau Noi Chuan

Mau cau:

```text
[so luong] [tu mon] [size] [do ngot/vi] [da] [binh rieng]
```

Vi du tot:

```text
sua nho it ngot it da
2 den vua khong duong
muoi lon danh kem
dac thom it ngot
```

Vi du khong nen dung:

```text
cho em lam mot ly ca phe sua da nho bot ngot voi it da nha
```

Ly do: cau dai co nhieu tu thua, de bi nhieu va de tach sai.

## Bo Tu Chuan Cho Tuy Chon

### So Luong

| Y nghia | Tu nhan dien duoc phep |
|---|---|
| 1 | 1, mot, mot ly |
| 2 | 2, hai, hai ly |
| 3 | 3, ba, ba ly |
| 4 | 4, bon, tu |
| 5 | 5, nam |

Neu nhan vien khong noi so luong, app hieu la `1`.

### Size

| Y nghia | Tu nhan dien duoc phep |
|---|---|
| Size S | s, nho |
| Size M | m, vua |
| Size L | l, lon |

Luu y theo menu:

- Mon chi co `S/M`: `nho` = S, `vua` hoac `lon` = M.
- Mon chi co `M/L`: `nho` hoac `vua` = M, `lon` = L.
- Mon chi co 1 size: app dung size duy nhat cua mon do.

### Do Ngot / Vi

| Y nghia | Tu nhan dien duoc phep |
|---|---|
| Vua | vua |
| It ngot | it ngot, it |
| Ngot | ngot |
| Khong duong | khong duong, khong |
| Chua | chua |

Khuyen nghi: neu noi `it`, app nen hieu la `it ngot` khi no nam sau ten mon.

### Da

| Y nghia | Tu nhan dien duoc phep |
|---|---|
| Vua | vua da |
| It da | it da |
| Nhieu da | nhieu da |

Khuyen nghi: nhan vien nen noi ro `it da`, khong chi noi `it`, vi `it` de bi hieu thanh `it ngot`.

### Ghi Chu Dac Biet

| Y nghia | Tu nhan dien duoc phep |
|---|---|
| Binh rieng | binh rieng, binh ca nhan, trong binh |
| Danh kem | danh kem |

## Bang Fill Tu Viet Tat Cho Menu

Cach dung:

- Chu quan va nhan vien cung dien cot `Tu goi chinh`.
- Moi mon chi chon 1 tu goi chinh ngan nhat ma nhan vien that su dung.
- Cot `Tu viet tat phu` la tuy chon, chi them neu nhieu nhan vien da quen dung.
- Cot `Tu tranh dung` de ghi nhung tu de nham voi mon khac.

| Nhom | Ten mon trong app | Size co san | Tu goi chinh can chot | Tu viet tat phu duoc phe duyet | Tu tranh dung / de nham | Ghi chu |
|---|---|---:|---|---|---|---|
| Traditional Cafe | Phin Den Da | S/M | ___ | ___ | ___ | ___ |
| Traditional Cafe | Phin Sua Da | S/M | ___ | ___ | ___ | ___ |
| Traditional Cafe | Phin Bac Xiu | S/M | ___ | ___ | ___ | ___ |
| Traditional Cafe | Phin Sua Tuoi | S/M | ___ | ___ | ___ | ___ |
| Traditional Cafe | Phin Sua Ca Cao | S/M | ___ | ___ | ___ | ___ |
| Cold Brew Cafe | Cold Brew Truyen Thong | S/M | ___ | ___ | ___ | ___ |
| Cold Brew Cafe | Cold Brew Chanh | M | ___ | ___ | ___ | ___ |
| Cold Brew Cafe | Cold Brew Sua Tuoi | M | ___ | ___ | ___ | ___ |
| Special Cafe | Cafe Muoi | S/M | ___ | ___ | ___ | ___ |
| Special Cafe | Capuchino | S/M | ___ | ___ | ___ | ___ |
| Special Cafe | Latte Vi Hanh Nhan | S/M | ___ | ___ | ___ | ___ |
| Special Cafe | Latte Vi Hat Phi | S/M | ___ | ___ | ___ | ___ |
| Special Cafe | Latte Vi Caramel | S/M | ___ | ___ | ___ | ___ |
| Special Cafe | Latte Vi Chocolate | S/M | ___ | ___ | ___ | ___ |
| Special Cafe | Machiato Latte | S/M | ___ | ___ | ___ | ___ |
| Special Cafe | Machiato Caramel | S/M | ___ | ___ | ___ | ___ |
| Special Cafe | Machiato La Dua | S/M | ___ | ___ | ___ | ___ |
| Special Cafe | Latte Latte Sua Yen Mach | M | ___ | ___ | ___ | ___ |
| Cacao | Cacao Sua Da | S/M | ___ | ___ | ___ | ___ |
| Cacao | Cacao Sua Tuoi | S/M | ___ | ___ | ___ | ___ |
| Cacao | Cacao Bac Ha | M | ___ | ___ | ___ | ___ |
| Tea With Milk | Tra Sua Tram's | L | ___ | ___ | ___ | ___ |
| Tea With Milk | Hong Tra Sua | L | ___ | ___ | ___ | ___ |
| Tea With Milk | Oolong Sua | L | ___ | ___ | ___ | ___ |
| Tea | Oolong Chanh Mat Ong | M/L | ___ | ___ | ___ | ___ |
| Tea | Hong Tra Dao | M | ___ | ___ | ___ | ___ |
| Tea | Hong Tra Thao Moc | M | ___ | ___ | ___ | ___ |
| Tea | Tra Lai Vai | M | ___ | ___ | ___ | ___ |
| Tea | Tra Lai Dac Thom | M | ___ | ___ | ___ | ___ |
| Tea | Tra Lai Cam Dac | M | ___ | ___ | ___ | ___ |
| Tea | Tra Sen Cold Brew Vi Tao | M | ___ | ___ | ___ | ___ |
| Tea | Tra Oolong Cold Brew Vi Mo Dao | L | ___ | ___ | ___ | ___ |

## Vong Fill Tu Voi Nhan Vien

Lan 1: chu quan dien tu theo menu.

- Cau hoi: "Neu dang dong khach, em se goi mon nay bang 1-2 tu nao?"
- Chi ghi tu ma nhan vien that su noi tu nhien.

Lan 2: nhan vien doc thu 20 order mau.

- Neu AI nghe nham 2 mon, doi tu goi chinh cua 1 trong 2 mon.
- Neu 1 mon co qua nhieu cach goi, chon lai toi da 3 tu.

Lan 3: khoa bo tu.

- Sau khi demo on, khong them tu tuy tien trong ca ban.
- Chi them tu moi sau khi ca lam xong, tranh lam parser thay doi giua luc dong khach.

## Mau Order De Test

Dung cac mau nay sau khi da fill tu goi chinh:

```text
1 [tu mon phin sua da] nho it ngot it da
2 [tu mon phin den da] vua khong duong
1 [tu mon cafe muoi] lon vua danh kem
1 [tu mon tra lai dac thom] it ngot
1 [tu mon tra lai vai] vua da binh rieng
```

## Quyet Dinh Can Chot Truoc Khi Code

- Tu goi chinh cua tung mon.
- Tu nao bi cam vi de nham voi mon khac.
- Co cho phep nhan vien noi khong dau/khong ro dau hay khong.
- Lenh gui bep bang giong noi se la `gui bep` hay van bat buoc bam nut gui.
- Khi nghe khong ro: giu order cu va bao noi lai, khong tu xoa order.
