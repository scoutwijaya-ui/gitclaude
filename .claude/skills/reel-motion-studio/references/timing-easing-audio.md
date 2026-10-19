# Timing, Easing & Audio

## Grid waktu

Semua reel referensi terasa "rapat" karena perubahan visual jatuh di grid ketukan.

| BPM | 1 ketuk | 1 bar (4 ketuk) | Frame/ketuk @30fps |
|---|---|---|---|
| 100 | 0,600 s | 2,4 s | 18 |
| 120 | 0,500 s | 2,0 s | 15 |
| 128 | 0,469 s | 1,875 s | 14,1 |
| 140 | 0,429 s | 1,714 s | 12,9 |

- Default **120 BPM, 30 fps** → 15 frame per ketuk; hitungan bulat, mudah diedit.
- Panjang scene ditulis dalam **ketukan** (`beats`), bukan detik. Ganti BPM, semua ikut bergeser.
- Pergantian scene = awal ketukan. Aksen kecil (pop kata, counter berhenti) = ½ atau ¼ ketukan.
- Hold outro minimal 3 ketuk (1,5 s) agar nama/CTA terbaca.

## Struktur durasi

| Durasi total | Hook | Isi | Outro |
|---|---|---|---|
| 8–10 s (logo sting/intro) | 0–2 s | 2–7 s | 7–10 s |
| 12–15 s (showreel/kolase) | 0–1 s | 1–12 s, 6–8 scene | 12–15 s |
| 15–18 s (narasi) | 0–2 s | 1 frasa per scene | 2–3 s terakhir |

Kecepatan baca: ±3 kata per detik. Kalimat 6 kata butuh ≥ 2 detik di layar.

## Easing

Implementasi ada di objek `E` dalam template.

| Nama | Kapan dipakai | Padanan |
|---|---|---|
| `expoOut` | **Default** untuk masuk: melesat lalu mengendap | `cubic-bezier(0.16, 1, 0.3, 1)`, GSAP `expo.out` |
| `expoIn` | Keluar/menutup: diam lalu melesat pergi | GSAP `expo.in` |
| `expoInOut` | Morph/transformasi A→B di tengah layar | GSAP `expo.inOut` |
| `backOut` | Pop kata kunci, benda jatuh yang memantul sedikit | GSAP `back.out(1.7)` |
| `sineInOut` | Gerak idle melayang/bernapas | GSAP `sine.inOut` |
| linear | Hanya rotasi kontinu, marquee, partikel | — |

Durasi umum: masuk 0,3–0,6 s · keluar 0,2–0,3 s · morph 0,6–1,0 s.

**Marquee "berdetak"** (reel 5): posisi = `(nomorKetuk + expoOut(fraksiKetuk)) × jarak`. Baris melompat tiap ketukan lalu diam, bukan bergeser linear.

## Audio

Render default **tanpa suara**. Musik ditambahkan di aplikasi (Instagram/TikTok) agar memakai audio berlisensi platform, atau digabung saat render dengan `--audio file.mp3` **hanya bila haknya jelas**.

Peta sound design dari referensi (untuk diserahkan ke editor/pengguna):

| Momen visual | Suara |
|---|---|
| Pergantian scene/bab | Kick atau sub-bass hit |
| Kata dibanting / kata kunci pop | Impact pendek + klik |
| Transisi wipe/whip | Whoosh (low-pass) |
| Counter, toggle, UI | Klik digital, tally ticker |
| Benda jatuh/jeruji | Clank metal |
| Objek hero mendarat | Drop lagu + SFX khas objek (decit ban, dsb.) |
| Outro | Pad synth memudar + satu kick terakhir |

Setiap hand-off wajib menyertakan **daftar waktu potongan** (detik) agar musik bisa diselaraskan.
