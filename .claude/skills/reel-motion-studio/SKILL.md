---
name: reel-motion-studio
description: Produksi motion video graphic vertikal (Reels/TikTok/Shorts) dengan gaya eksklusif yang diturunkan dari 6 reel referensi — Code-HUD Showreel, Swiss Poster Collage, Editorial Collage "Aura", Brand Intro Hero 3D, dan 3D Device + Neon Kinetic. Dibuat penuh dengan kode (HTML/CSS/Canvas, frame-akurat) lalu dirender ke MP4 lewat Chromium headless + ffmpeg. Gunakan saat pengguna meminta motion graphic, showreel, intro brand, kinetic typography, video kolase editorial, logo sting, atau "video seperti reel referensi itu", walau hanya menyebut tampilannya.
---

# Reel Motion Studio

Skill untuk membuat motion graphic pendek 9:16 dengan bahasa visual yang sama dengan 6 reel referensi (lihat `references/analisis-6-reel.md`). Setiap video adalah satu file HTML di mana **setiap piksel adalah fungsi dari waktu `t`**. Renderer melompat ke tiap frame, memotret, lalu menyusun MP4. Hasilnya bisa diulang persis dan tiap ketukan bisa diperbaiki lalu dirender ulang.

## Lima gaya

| Kode | Gaya | Ciri utama | Template |
|---|---|---|---|
| A | Code-HUD Showreel | HUD + timecode, bab bernomor, vermilion/krem/arang, partikel & primitif | `templates/hud-showreel.html` ✅ |
| B | Swiss Poster Collage | Foto B/W cutout, lingkaran merah besar, 1 frasa = 1 poster | resep |
| C | Editorial Collage "Aura" | Kertas krem, cutout subjek, teks kecil + KATA KUNCI oranye | resep |
| D | Brand Intro Hero 3D | Bola cahaya mengedit kalimat, panel vertikal, objek hero mendarat di drop | resep |
| E | 3D Device + Neon Kinetic | Ponsel 3D memuntahkan UI, teks neon sumbu-z, logo krom | resep |

Resep lengkap (palet, tipografi, struktur, gerak) ada di `references/gaya-dan-resep.md`.

## Alur kerja

### 1. Brief singkat
Tanyakan hanya yang belum ada; selebihnya pakai default dan tulis sebagai asumsi.
- **Pesan & teks layar** (tulis sendiri bila pengguna hanya memberi topik; ±3 kata/detik).
- **Gaya** (A–E atau gabungan) — pilih dari tabel "Memilih gaya cepat" di `gaya-dan-resep.md`.
- **Format:** default 1080×1920, 30 fps. Feed 4:5 = 1080×1350; YouTube 16:9 = 1920×1080.
- **Durasi:** default 12 s (showreel/kolase), 8–10 s (intro/logo sting).
- **Aset:** logo, warna merek, foto/cutout PNG, model 3D. Hanya aset milik sendiri atau berlisensi.
- **BPM:** default 120.

### 2. Beat sheet
Sebelum membangun, tulis tabel: `# | ketuk | detik | visual & gerak | teks layar | suara`. Tunjukkan ke pengguna untuk video > 8 s atau untuk klien. Aturan dari referensi:
- **Frame 0 sudah bergerak/berisi teks.** Tidak boleh dibuka dengan layar kosong atau logo.
- Scene 2–4 ketukan (1–2 s). Satu scene = satu ide.
- Outro: nama/logo + satu CTA, tahan ≥ 3 ketukan.

### 3. Bangun
```bash
mkdir -p <kerja>/<proyek> && cp <skill>/templates/hud-showreel.html <kerja>/<proyek>/index.html
```
Untuk gaya A, ubah `CONFIG` dan `SCENES` saja. Untuk gaya lain, pakai mesin yang sama (util, `E`, `SCENES`, `renderAt`, HUD opsional) dan ganti isi `renderScene` sesuai resep.

**Kontrak render (wajib):**
- `window.MOTION = { width, height, fps, duration }`
- `window.renderAt(t)` menggambar frame pada detik `t`, **murni dari `t`**.
- `window.ready` = Promise yang selesai saat font/gambar siap.

**Aturan agar render tidak rusak:**
- Dilarang: CSS `animation`/`transition`, `requestAnimationFrame` (kecuali mode `?play`), `setTimeout`, `Date.now()`, `Math.random()`. Pakai `rand(seed)` untuk acak.
- Layout piksel tetap di panggung `--W × --H`; jangan pakai `vw`/`vh`/`%` untuk ukuran huruf.
- Font lokal. Yang terpasang di lingkungan ini: **Inter / Inter Display** (display & UI), **DejaVu Serif** (serif italic), **Liberation Mono** (HUD). Font lain: muat file `.woff2` lokal lewat `@font-face` dan tunggu di `window.ready`.
- Gambar: tunggu `img.decode()` di dalam `window.ready`.
- Zona aman 9:16: teks penting di antara y = 250 dan y = 1500 (UI aplikasi menutupi atas & bawah), margin samping ≥ 96 px.

### 4. Cek visual sebelum render penuh
```bash
node <skill>/scripts/render.mjs index.html out/x.mp4 --stills 0.3,2,4,6,8,11.5
```
Gabungkan still jadi satu lembar kontak (`ffmpeg ... xstack`) lalu lihat. Periksa: teks terpotong tepi, kontras HUD terhadap latar, frame 0 tidak kosong, outro terbaca.

### 5. Render
```bash
node <skill>/scripts/render.mjs index.html out/video.mp4            # final, CRF 16
node <skill>/scripts/render.mjs index.html out/preview.mp4 --preview  # cepat, ½ resolusi, 15 fps
node <skill>/scripts/render.mjs index.html out/video.mp4 --audio musik.mp3  # hanya audio berlisensi
```
Butuh `playwright` dan `ffmpeg`. Video 12 s @30 fps ≈ 40 detik render di lingkungan ini.
Verifikasi: `ffprobe -v error -show_entries stream=width,height,r_frame_rate,nb_frames -of compact out/video.mp4`.

Pratinjau langsung di browser: buka `index.html?play`.

### 6. Hand-off
Sertakan:
1. Path MP4 + still lembar kontak.
2. Daftar waktu potongan (detik) untuk sinkron musik + peta SFX dari `references/timing-easing-audio.md`.
3. Asumsi yang dipakai (teks, warna, durasi, BPM).
4. Cara mengubah: bagian `CONFIG` mana yang perlu diedit.

## Batasan
- Jangan meniru logo, wordmark, atau karakter milik kreator/merek lain dari reel referensi. Yang diambil adalah **bahasa visual**: struktur, ritme, palet, tipografi, dan teknik gerak.
- Jangan memakai potongan film, kartun, atau foto orang nyata tanpa izin.
- Konten dengan karakter AI wajib mengikuti aturan label konten AI di platform tujuan; cek sumber resmi sebelum unggah.
- Video dirender tanpa suara kecuali pengguna memberikan audio yang haknya jelas.

## File
- `references/analisis-6-reel.md` — analisis per reel dan pola bersama.
- `references/gaya-dan-resep.md` — resep produksi 5 gaya. **Selalu baca** sebelum membangun.
- `references/timing-easing-audio.md` — grid BPM, easing, peta suara. Baca bila mengatur ritme.
- `templates/hud-showreel.html` — komposisi gaya A yang sudah teruji (12 s, 7 bab, 120 BPM).
- `scripts/render.mjs` — renderer HTML → MP4/PNG.
