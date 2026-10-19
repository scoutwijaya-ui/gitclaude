# Lima Gaya & Resep Produksi

Setiap gaya diturunkan dari reel di `analisis-6-reel.md`. Semua bisa dibuat penuh di kode (HTML + CSS + Canvas/SVG) dengan kontrak render di `SKILL.md`. Gaya D dan E bagian 3D-nya bisa dibuat di kode (three.js) atau digantikan foto/render produk.

---

## A. Code-HUD Showreel
**Dari:** reel 1 & 5 · **Cocok untuk:** showreel, portofolio jasa, peluncuran tool/SaaS, "apa yang bisa kami buat".
**Template siap pakai:** `templates/hud-showreel.html`.

| Aspek | Aturan |
|---|---|
| Palet | `#121314` arang · `#EBE7DF` krem · `#E63B1E` vermilion · putih. Latar berganti gelap → merah → krem tiap bab agar mata tidak bosan. |
| Tipografi | Display grotesk 900, tracking −0,04em untuk kata besar · serif italic untuk label bab (`form.`, `systems`) · mono 26 px kapital tracking +0,08em untuk HUD. |
| HUD tetap | 4 tanda sudut · judul kiri atas · timecode kanan atas · `NN/NN BAB` kiri bawah · `● BPM` kanan bawah · progress bar. Warna HUD mengikuti latar scene. |
| Struktur | 6–8 bab × 1–2 s. Tiap bab satu "kata kerja" visual: TYPE, FORM, SYSTEMS, DEPTH, INTERFACE, FLUID, RHYTHM. |
| Gerak khas | Pil jatuh + iris membanjiri layar · kata dibanting (scale 1,6→1 + scaleX 0,6→1 + tracking menyempit) · irisan diagonal sebagai transisi · bola partikel berotasi lalu runtuh jadi titik · counter angka expo-out · marquee yang melompat per ketukan. |
| Outro | Wordmark dengan titik berwarna aksen, peran dalam serif italic aksen, status berkedip per ketukan. |

**Blok scene tambahan (belum ada di template, tambahkan bila perlu):**
- *DEPTH*: 3–5 kartu di carousel `rotateY` dengan `perspective: 1600px`; kata raksasa outline di belakang bergerak berlawanan arah.
- *FLUID*: 6–8 lingkaran SVG dengan filter `feGaussianBlur` + `feColorMatrix` (gooey); posisi dari `sin/cos(t)`.
- *ISO GRID*: kotak isometrik yang tingginya `sin(jarak − t)`.

---

## B. Swiss Poster Collage
**Dari:** reel 2 · **Cocok untuk:** narasi/voice-over, quote, opini, edukasi singkat.

| Aspek | Aturan |
|---|---|
| Palet | Kertas `#EDEDED` · hitam `#0A0A0A` · merah `#E5121B` · (opsional) lime kecil `#C6FF3D` untuk satu detail. |
| Komposisi | Grid 12 kolom dengan margin 96 px. Satu **lingkaran merah besar** (Ø 600–800 px) sebagai jangkar. Foto subjek **hitam-putih, background dihapus**, menumpuk di atas lingkaran. Detail kecil: barcode, nomor seri (`ARCH / VHS 073`), label kredit, judul vertikal. |
| Teks | Subtitle per frasa (maks 6 kata), sans 64–80 px, kata penting bold. Posisi tetap di tengah-bawah agar mudah dibaca. |
| Struktur | 1 frasa narasi = 1 poster = 1,2–2 s. Ganti poster tepat di awal frasa berikutnya. |
| Gerak | Push-in parallax 2.5D (latar 1,00→1,04, subjek 1,00→1,08) · wipe vertikal antar poster · snap-zoom 1,15→1 di kata penting · goyang kecil (±6 px) pada objek berat. |
| Outro | Layar hitam polos, nama studio huruf kecil bold, tahan 2 s. |

**Aset:** foto sendiri/berlisensi atau ilustrasi AI. Jangan memakai karakter film, kartun, atau orang terkenal tanpa izin.

---

## C. Editorial Collage "Aura"
**Dari:** reel 4 · **Cocok untuk:** motivasi, tips kreator, konten karakter AI (mis. Ghania Ayunda), hook opini.

| Aspek | Aturan |
|---|---|
| Palet | Krem `#F5EFEB` bertekstur kertas · arang `#1C1C1C` · oranye bata `#E0491B` · emas `#B8945A` untuk objek 3D/metalik. Sesekali kartu gelap untuk kontras. |
| Teks dua lapis | Baris 1: frasa pengantar huruf kecil (sans 56 px, atau serif italic). Baris 2: **KATA KUNCI** kapital kondensed oranye 120–160 px, pop dengan `backOut` (scale 0,6→1). |
| Dekorasi | Bounding box dengan titik jangkar di sekeliling subjek, crosshair, grid tipis 1 px, barcode, tag kecil (`4K ULTRA HD`, `@handle`), bintang 4-sudut. |
| Subjek | Cutout PNG transparan: patung, figur, produk, atau karakter. Bayangan lembut di bawah. |
| Struktur | 6–9 scene × ±2 s. Klimaks: teks raksasa **di belakang** subjek (urutan layer: latar → teks besar → subjek → teks kecil). |
| Gerak | Melayang idle (y = 8·sin(t·1,5)) · push-in pelan · transisi snap-zoom/whip dengan blur arah. |
| Outro | CTA tunggal (mis. "komentar PRESET"), latar gelap, teks bersinar. |

---

## D. Brand Intro Hero 3D
**Dari:** reel 3 · **Cocok untuk:** intro personal brand, peluncuran produk, logo sting 8–10 s.

| Aspek | Aturan |
|---|---|
| Palet | Satu warna merek yang sangat jenuh sebagai lantai (contoh `#FFC800`) + hitam `#0A0A0A` + putih. |
| Babak 1 (0–2 s) | Latar gelap. Bola cahaya bergaris melintas dan **mengganti kata** dalam kalimat (teks lama tercoret/terhapus mengikuti posisi bola). |
| Babak 2 (2–4 s) | 4 panel vertikal bergantian hitam/warna merek, teks diputar 90°, masuk berurutan dengan jeda 0,08 s; lalu flip/slide keluar. |
| Babak 3 (4–10 s) | **Objek hero mendarat tepat di ketukan drop**: produk/kendaraan/logo 3D tampak atas, jejak lengkung (path SVG dengan `stroke-dashoffset`) → mengendap ke lockup: nama besar kondensed + kata script kecil + 3 baris peran. |
| Gerak | Masuk sangat cepat (0,3 s) lalu "bernapas" (scale 1→1,01, sin pelan) saat ditahan. |

Bila tidak ada model 3D: pakai foto produk PNG tampak atas + bayangan blur, gerakkan di sepanjang kurva Bezier dan putar mengikuti arah singgung.

---

## E. 3D Device + Neon Kinetic
**Dari:** reel 6 · **Cocok untuk:** promosi akun/kursus/aplikasi, konten musik/lirik.

| Aspek | Aturan |
|---|---|
| Palet | Navy `#060B1F`–hitam · perak · biru listrik `#2F6BFF` · neon merah `#FF2D3D`, kuning `#FFD400`, cyan `#29E3FF`. |
| Pembuka | Mockup ponsel (CSS 3D: `perspective` + `rotateY/rotateX`) berisi tangkapan layar profil/aplikasi; 3–5 kartu keluar dari layar di `translateZ` berbeda; kamera menyelam ke satu elemen (scale ×8 + blur). |
| Kinetik | Kata muncul satu per satu mengikuti suku kata/beat, berpindah sumbu-z (scale 3→1 + blur 20→0 px). Glow neon: `text-shadow` berlapis 3 (0, 12, 40 px). |
| Efek | Chromatic aberration (3 salinan teks R/G/B bergeser 2–4 px) · shake kamera ±8 px selama 0,15 s di kick · jeruji/objek jatuh dengan `backOut`. |
| Outro | Logo krom: gradien linear perak + garis cahaya putih diagonal yang menyapu kiri→kanan dalam 0,8 s. |

Model 3D asli (GLB) bisa dirender dengan three.js mengikuti kontrak yang sama: posisi kamera dihitung dari `t` di `renderAt`, lalu `renderer.render()` dipanggil di dalamnya.

---

## Memilih gaya cepat

| Tujuan konten | Gaya |
|---|---|
| Jual jasa motion/desain, showreel | A |
| Narasi suara/quote/edukasi | B |
| Konten karakter, motivasi, tips kreator | C |
| Intro nama/brand, peluncuran produk | D |
| Promosi akun/aplikasi/kursus, video lirik | E |

Gaya boleh digabung: misalnya hook D → isi C → outro A.
