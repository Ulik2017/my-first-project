# Aplikasi Sales (Project & Regular) - Database MySQL

Aplikasi sales dengan menu:
- Login (administrator memilih mode Project / Regular)
- Sales Master
- Customer Master
- Detail Quotation
- Calendar Progress (lead, contacted, qualified, proposal made, won, lost)

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
Jalankan dengan PHP built-in server:
```bash
php -S 127.0.0.1:8000
```
Lalu buka `http://127.0.0.1:8000`.

## Login default
- `admin / admin123` (administrator)
- `sales1 / sales123`

## Catatan
- Data tersimpan di database MySQL (bukan localStorage).
- Pengaturan koneksi ada di `db.php`.
