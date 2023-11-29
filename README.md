# KELOMPOK 5
Mata kuliah Pemrograman Web Dosen: Novian Adi Prasetyo

## Anggota
1. Ferina Nur Wahyumi
2. Fatkhurrohman Purnomo 
3. Amalia Tri Rahayu


## Initial Project
1. Silahkan clone repo ini `git clone https://gitlab.com/21102125-mm1-pw2324/kelompok-5.git`
2. Masuk ke folder projek `cd kelompok-5`
3. Buat `.env` file pada projek, contoh isinya ada di file `.env.example`
4. Install semua dependency dengan `npm install`
5. Jalankan projek dengan `npm run start`

## Setup database
1. Jalankan perintah `npx prisma migrate dev` untuk melakukan migrasi database projek kamu

## Cara berkolaborasi
1. Ketika ingin melakukan kolaboarsi buat branch baru misal 
- `git branch [nama-branch]`
Contoh: `git branch feat/register`
2. Ketika sudah membuat branch baru silahkan checkout ke branch tersebut
- `git checkout feat/register`
3. Ketika sudah selesai membuat feature di branch tersebut silahkan lakukan penyimpanan semua perubahan
- `git add .`
4. Jangan lupa beri komentar pada perubahan tersebut sesuai apa yang kamu kerjakan
- `git commit -m "feat: menambahkan fungsi register"`
- `git commit -m "fix: memperbaiki bug fungsi register"`
- `git commit -m "improve: melakukan improvment pada fungsi register"`
5. Lakukan push sesuai nama branch yang sudah kalian buat
- `git push origin feat/register`
6. Dan yang terakhir buat pull request supaya teman yang lain dapat mereview hasil kerja kamu.

