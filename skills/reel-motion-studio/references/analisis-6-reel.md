# Analisis 6 Reel Referensi

Sumber gaya untuk skill ini. Analisis dibuat 19 Okt 2026 dengan vidIQ (`vidiq_watch_shortform_content`), karena Instagram tidak bisa dibuka langsung dari lingkungan kerja.

> **Catatan akurasi:** semua timestamp, kode warna hex, nama font, dan "tool yang dipakai" adalah **perkiraan dari analisis AI atas video**, bukan data dari kreatornya. Pakai sebagai arah gaya, bukan spesifikasi pasti.

## Ringkasan

| # | Reel | Kreator/brand terlihat | Durasi | Gaya → dipetakan ke |
|---|---|---|---|---|
| 1 | [DeKUZvGsiDk](https://www.instagram.com/reel/DeKUZvGsiDk/) | "CLAUDE. motion designer" (rekaman layar laptop) | ±14 s | **A. Code-HUD Showreel** |
| 2 | [DamzkLfAFYy](https://www.instagram.com/reel/DamzkLfAFYy/) | miracle studios | ±15 s | **B. Swiss Poster Collage** |
| 3 | [DaIq2aZTlln](https://www.instagram.com/reel/DaIq2aZTlln/) | Aslani Edits | ±11 s | **D. Brand Intro Hero 3D** |
| 4 | [DXtv0xbEcFD](https://www.instagram.com/reel/DXtv0xbEcFD/) | feather frames (marvx.motion) | ±18 s | **C. Editorial Collage "Aura"** |
| 5 | [DdzH3FpONMD](https://www.instagram.com/reel/DdzH3FpONMD/) | "CLAUDE. SHOWREEL '26" | 15 s | **A. Code-HUD Showreel** |
| 6 | [DdO63LGPBsn](https://www.instagram.com/reel/DdO63LGPBsn/) | Slate Academy | ±15 s | **E. 3D Device + Neon Kinetic** |

## Pola yang sama di keenam reel

1. **Vertikal 9:16, 10–18 detik.** Semua berakhir di kartu logo/nama yang ditahan ±1,5–3 detik.
2. **Hook di frame pertama.** Tidak ada yang dibuka dengan layar hitam kosong atau logo. Frame 0 sudah berisi gerakan atau kalimat.
3. **Scene pendek: 0,8–2 detik.** Ganti gambar tiap 1–4 ketukan pada 120 BPM.
4. **Easing "tembak lalu mengendap"**: expo-out / `cubic-bezier(0.16, 1, 0.3, 1)`. Elemen melesat cepat lalu berhenti halus. Hampir tidak ada gerak linear, kecuali marquee dan rotasi kontinu.
5. **Palet 3 warna + 1 aksen.** Gelap/terang netral + satu warna aksen yang keras (oranye-merah, merah, atau kuning).
6. **Tipografi kontras dua karakter.** Grotesk tebal/kondensed untuk kata kunci, dipadu serif italic atau mono kecil untuk pelengkap.
7. **Lapisan "teknis"**: HUD, tanda sudut, crosshair, barcode, bounding box, timecode, label `FIG. 02`. Ini memberi kesan "dibuat oleh desainer" dengan biaya produksi kecil.
8. **Suara dikunci ke potongan**: sub-bass hit di pergantian scene, klik digital di elemen UI, whoosh di transisi. (Skill ini merender video tanpa suara; lihat `timing-easing-audio.md`.)

## Rincian per reel

### 1 · DeKUZvGsiDk — Code-HUD showreel, oranye/hitam
- **Hook:** grid titik + teks `INITIALIZING...` meledak jadi garis cahaya anamorfik horizontal, lalu langsung kartu judul oranye "CLAUDE. motion designer".
- **Rangkaian scene (±1 s/scene, 11 scene):** kartu judul editorial → grid isometrik bergelombang + bola krom → tumpukan kata "SINGLE" bergelombang sinus → dashboard `+312%` dengan gauge 78% dan bar → medan partikel curl-noise → mandala titik konsentris (moiré) → modal UI "Render queue" dengan toggle → terowongan gradien radial → blob organik → logo glyph penutup.
- **Palet:** `#0D0D11`, `#FFFFFF`, oranye `#E64A19`/`#FF3B00`, kuning `#FFCC00`, sesekali biru kobalt `#002699`.
- **Pelajaran:** satu scene = satu "demo kemampuan". Label HUD (`03 / NOISEFLOW`, `VIEW 01 / 07`) menyatukan scene yang sangat berbeda.

### 2 · DamzkLfAFYy — Poster Swiss, kolase hitam-putih + lingkaran merah
- **Hook:** poster: pria tertimpa batu besar di depan komputer jadul, lingkaran merah besar, palet tool Photoshop, barcode; subtitle "getting good at editing" muncul.
- **Struktur:** narasi voice-over dibagi per frasa; **satu frasa = satu poster** ("is not just about the skills" → "it's about you" → "how you observe…" → "either in movies" → "or in animated films" → "studying the work of other people" → "and implementing it in your own ideas") → kartu hitam "miracle studios".
- **Gerak:** parallax 2.5D halus, wipe vertikal, snap-zoom di ketukan, whip pan antar poster.
- **Palet:** hitam `#000`, kertas `#E6E6E6`–`#F0F0F0`, merah `#E50914`/`#FF2222`, aksen lime kecil.
- **Catatan hak cipta:** reel aslinya memakai potongan karakter film/animasi milik pihak lain. Skill ini **tidak** meniru bagian itu; pakai foto sendiri, aset berlisensi, atau ilustrasi buatan sendiri.

### 3 · DaIq2aZTlln — Intro personal brand, kuning/hitam + mobil 3D
- **Hook:** bola cahaya kuning melintas dan "mengedit" kalimat: "Every journey starts somewhere." → "…with an idea."
- **Lalu:** panel vertikal hitam/kuning bergantian dengan teks diputar 90° ("Yours | ends | with a | story"), flip 2.5D cepat → mobil kuning tampak atas drifting, jejak ban melengkung, berhenti di lockup nama besar kondensed + script kecil + 3 baris peran.
- **Palet:** kuning `#FFC800`, hitam `#0A0A0A`, putih.
- **Pelajaran:** **objek hero yang "mendarat" tepat di beat drop** (±4 s) lalu menjadi bagian layout logo.

### 4 · DXtv0xbEcFD — Editorial collage "aura", kertas krem + oranye
- **Hook:** patung raja bertopeng di dalam bounding box + "you know what real **AURA** is".
- **Formula tiap scene (±2 s):** subjek cutout (patung, robot, prajurit Sparta, bust David) + elemen grafis (grid, crosshair, barcode, tag `4K ULTRA HD`) + **teks dua lapis**: frasa kecil sans/italic serif → **kata kunci kapital oranye** yang muncul dengan pop/bounce.
- **Klimaks:** teks besar "ENTIRE STORY" di belakang subjek, subjek di depan (pemisahan 2.5D). Penutup: CTA `comment "XML"`.
- **Palet:** krem `#F5EFEB`, arang `#1C1C1C`, oranye bata `#E64A19`/`#D34010`, emas metalik.
- **Pelajaran:** gaya paling mudah diproduksi ulang dengan aset AI/foto + teks di kode.

### 5 · DdzH3FpONMD — Showreel kode "0 keyframes by hand"
- **Spesifikasi terlihat:** 15 s, 450 frame, 30 fps, 120 BPM, "HTML · CSS · SVG · CANVAS · GSAP".
- **HUD tetap:** tanda sudut, `SHOWREEL '26`, timecode berjalan, bab `XX/07 NAMA`, progress bar, `● 120 BPM`.
- **7 bab:** INIT (pil merah jatuh ke target, iris membanjiri merah) → TYPE (kata besar dibanting, irisan diagonal) → FORM (primitif Swiss: lingkaran, setengah lingkaran, segitiga, belah ketupat, pil) → SYSTEMS (1.200 partikel bola berotasi lalu runtuh jadi titik merah) → DEPTH (carousel kartu 3D, teks raksasa di belakang) → INTERFACE (counter angka, bar, toggle, grafik garis) → FLUID (metaball/gooey) → RHYTHM (marquee baris berlawanan arah, tebal kapital vs serif italic) → outro wordmark + status "OPEN FOR PROJECTS".
- **Palet:** vermilion `#E63B1E`, krem `#EBE7DF`, hitam arang `#121314`.
- **Template `templates/hud-showreel.html` adalah rekonstruksi gaya ini.**

### 6 · DdO63LGPBsn — 3D device + kinetic neon
- **Hook:** iPhone 3D perak berputar menampilkan profil Instagram; kartu thumbnail melayang keluar layar di ruang-z; kamera menyelam ke foto profil.
- **Lalu:** logo kubus 3D membuka teks ekstrusi → ruang abu-abu terang, kursor 3D meledak jadi kata-kata lirik → ruang gelap dengan teks neon merah/kuning/biru, jeruji besi jatuh di atas teks → logo krom dengan sapuan cahaya.
- **Gerak:** dorongan kamera sumbu-z, depth of field, motion blur, chromatic aberration, camera shake di bass.
- **Palet:** navy/hitam, perak, biru listrik, neon merah/kuning/cyan.
- **Pelajaran:** "perangkat 3D yang memuntahkan UI" adalah hook kuat untuk akun yang menjual jasa/kursus.
