# Aplikasi Sales (AdminLTE + Trello-like Progress)

Aplikasi sales dengan tampilan **AdminLTE** dan progress board model **Trello** (drag & drop kolom).

## Fitur
- Login (administrator wajib pilih mode Project / Regular)
- Sales Master
- Customer Master
- Detail Quotation
- Progress Board kolom: lead, contacted, qualified, proposal made, won, lost
- Warna kartu berdasarkan nama sales

## Konfigurasi Database
- Host: `127.0.0.1`
- Username: `root`
- Password: *(kosong)*
- Database: `sales_app`

Import schema:
```bash
mysql -u root < schema.sql
```

## Menjalankan
```bash
php -S 127.0.0.1:8000
```
Buka `http://127.0.0.1:8000`.

## Login default
- `admin / admin123`
- `sales1 / sales123`
