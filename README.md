# API Produk dengan ExpressJS, Prisma, dan PostgreSQL

**Nama:** Mey Rosalina

**NRP:** 5027241004

**Mata Kuliah:** Pemrograman Web A

REST API daftar produk menggunakan ExpressJS, TypeScript, Prisma 7, dan PostgreSQL.
Struktur: route -> controller -> service -> Prisma.

---

# Bagian 1: Petunjuk Penggunaan

## Versi yang Dipakai

- Node.js: 20.19.6
- Express: 5.3.0
- TypeScript: 7.0.2
- Prisma dan @prisma/client: 7.10.1
- @prisma/adapter-pg: 7.10.1
- Database: PostgreSQL 18

## Instalasi

1. Clone repository dan masuk ke foldernya:
   ```bash
   git clone https://github.com/meyrosa/week10_Express-x-Database.git
   cd week9_expressjs
   ```
2. Install dependency:
   ```bash
   npm install
   ```
3. Salin `.env.example` menjadi `.env`, lalu isi dengan connection string PostgreSQL milikmu:
   ```bash
   cp .env.example .env
   ```
   Isi `.env.example`:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
   ```

## Migration

Pastikan database sudah dibuat dan `.env` sudah terisi, lalu jalankan:

```bash
npx prisma migrate dev
npx prisma generate
```

Model `Product`:

```prisma
model Product {
  id    Int    @id @default(autoincrement())
  name  String
  price Int
}
```

## Menjalankan

```bash
npm run dev
```

Server berjalan di `http://localhost:3000`.

## Daftar Endpoint

| Method | URL | Body | Status |
|---|---|---|---|
| GET | `/products` | - | 200 |
| GET | `/products/:id` | - | 200 / 400 / 404 |
| POST | `/products` | `{ "name": "Buku", "price": 15000 }` | 201 / 400 |
| PUT | `/products/:id` | `{ "name": "Buku Tulis", "price": 17000 }` | 200 / 400 / 404 |
| DELETE | `/products/:id` | - | 200 / 400 / 404 |

## Validasi

- `name`: string, tidak boleh kosong
- `price`: bilangan bulat, tidak negatif
- `id` pada path: bilangan bulat positif
- Input tidak valid menghasilkan status 400 dengan pesan JSON.
- Error server dibalas 500 dengan pesan umum, detail error hanya tercatat di terminal.

## Struktur Project

```
src/
├── controllers/product.controller.ts
├── lib/prisma.ts
├── middleware/request-logger.ts
├── routes/product.routes.ts
├── services/product.service.ts
├── app.ts
└── index.ts
prisma/
├── schema.prisma
└── migrations/
```

| Lapisan | Fungsi |
|---|---|
| Route | Memasangkan method dan URL ke controller |
| Controller | Validasi input, membaca request, mengirim response |
| Service | Akses database lewat Prisma |
| Prisma | ORM ke PostgreSQL |

---

# Bagian 2: Laporan Evidence

## 1. Tujuan

Melanjutkan API produk dari minggu ke-9 dengan menyimpan data di PostgreSQL menggunakan Prisma, sehingga data bertahan setelah server restart.

## 2. Skenario Pengujian (Postman)

### 2.1 Kondisi awal database (before)
Tabel `Product` pada Prisma Studio masih kosong.

![DB before](docs/screenshots/00-db-before.png)

### 2.2 POST produk pertama (sukses)
- Request: `POST /products`, body `{"name":"Buku","price":15000}`
- Harapan: 201 dan objek dengan `id` dari database.
- Hasil: 201 created dan id 1

![POST Buku](docs/screenshots/01-post-buku.png)

### 2.3 POST produk kedua (sukses)
- Request: `POST /products`, body `{"name":"Pulpen","price":5000}`
- Harapan: 201 dan `id` berbeda dari produk pertama.
- Hasil: 201 created dan id 2

![POST Pulpen](docs/screenshots/02-post-pulpen.png)

### 2.4 GET semua produk
- Request: `GET /products`
- Harapan: 200 dan array berisi dua produk.

![GET all](docs/screenshots/03-get-all.png)

### 2.5 GET produk berdasarkan ID
- Request: `GET /products/[id Buku]`
- Harapan: 200 dan satu objek produk Buku.

![GET by id](docs/screenshots/04-get-by-id.png)

### 2.6 GET produk tidak ditemukan
- Request: `GET /products/9999`
- Harapan: 404 dan `{"message":"Produk tidak ditemukan"}`.

![GET 404](docs/screenshots/05-get-404.png)

### 2.7 Validasi: name kosong
- Request: `POST /products`, body `{"name":"","price":1000}`
- Harapan: 400 dan pesan validasi.

![Validasi name kosong](docs/screenshots/06-validasi-name-kosong.png)

### 2.8 Validasi: price negatif
- Request: `POST /products`, body `{"name":"Penghapus","price":-5}`
- Harapan: 400.

![Validasi price negatif](docs/screenshots/07-validasi-price-negatif.png)

### 2.9 Validasi: price bukan integer
- Request: `POST /products`, body `{"name":"Penghapus","price":2.5}`
- Harapan: 400.

![Validasi price desimal](docs/screenshots/08-validasi-price-desimal.png)

### 2.10 Validasi: ID path tidak valid
- Request: `GET /products/abc`
- Harapan: 400.

![Validasi ID invalid](docs/screenshots/09-validasi-id-invalid.png)

### 2.11 PUT update produk
- Request: `PUT /products/[id Pulpen]`, body `{"name":"Pulpen Gel","price":7000}`
- Harapan: 200 dan data terupdate.

![PUT sukses](docs/screenshots/10-put-sukses.png)

### 2.12 PUT produk tidak ditemukan
- Request: `PUT /products/9999`, body `{"name":"X","price":1}`
- Harapan: 404.

![PUT 404](docs/screenshots/11-put-404.png)

### 2.13 DELETE produk
- Request: `DELETE /products/[id Pulpen]`
- Harapan: 200 dan pesan produk dihapus.

![DELETE sukses](docs/screenshots/12-delete-sukses.png)

### 2.14 DELETE produk tidak ditemukan
- Request: `DELETE /products/9999`
- Harapan: 404.

![DELETE 404](docs/screenshots/13-delete-404.png)

### 2.15 Data bertahan setelah restart
Server dihentikan (`Ctrl+C`) lalu dijalankan ulang dengan `npm run dev`, kemudian `GET /products`.
- Harapan: data yang tersimpan sebelumnya masih ada.

![Restart terminal](docs/screenshots/17-restart-terminal.png)

#### Data masih tersimpan
![GET setelah restart](docs/screenshots/18-get-setelah-restart.png)

## 3. Perubahan pada Database (Before-After)

| Tahap | Kondisi Tabel Product |
|---|---|
| Sebelum POST | Kosong |
| Setelah 2x POST | 2 baris (Buku, Pulpen) |
| Setelah PUT | Pulpen berubah menjadi Pulpen Gel, 7000 |
| Setelah DELETE | Sisa 1 baris (Buku) |

Sebelum POST:

![DB before](docs/screenshots/00-db-before.png)

Setelah 2x POST:

![DB setelah POST](docs/screenshots/14-db-setelah-post.png)

Setelah PUT:

![DB setelah PUT](docs/screenshots/15-db-setelah-put.png)

Setelah DELETE:

![DB setelah DELETE](docs/screenshots/16-db-setelah-delete.png)

## 4. Ringkasan Hasil

| No | Skenario | Status Diharapkan | Status Aktual | Hasil |
|---|---|---|---|---|
| 1 | POST Buku | 201 | 201 Created | Sesuai |
| 2 | POST Pulpen | 201 | 201 Created | Sesuai |
| 3 | GET /products | 200 | 200 OK | Sesuai |
| 4 | GET /products/:id | 200 | 200 OK | Sesuai |
| 5 | GET ID tidak ada | 404 | 404 Not Found | Sesuai |
| 6 | POST name kosong | 400 | 400 Bad Request | Sesuai |
| 7 | POST price negatif | 400 | 400 Bad Request | Sesuai |
| 8 | POST price desimal | 400 | 400 Bad Request | Sesuai |
| 9 | GET ID bukan angka | 400 | 400 Bad Request | Sesuai |
| 10 | PUT sukses | 200 | 200 OK | Sesuai |
| 11 | PUT ID tidak ada | 404 | 404 Not Found | Sesuai |
| 12 | DELETE sukses | 200 | 200 OK | Sesuai |
| 13 | DELETE ID tidak ada | 404 | 404 Not Found | Sesuai |
| 14 | GET setelah restart | 200 | 200 OK | Sesuai |

## 5. Kesimpulan

API produk berhasil dihubungkan dengan PostgreSQL menggunakan Prisma. ID dibuat oleh database (autoincrement), validasi input mengembalikan status 400, dan error server dibalas dengan pesan umum tanpa membocorkan detail koneksi. Data tetap tersimpan setelah server di-restart, berbeda dengan versi sebelumnya yang memakai array. Pemisahan route, controller, dan service membuat kode lebih mudah dipelihara.
