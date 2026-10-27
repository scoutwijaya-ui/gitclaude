# Skakmat — Raja Nggak Mau Kalah (Reels 60 detik)

Animasi komedi 3D orisinal, format 9:16 (1080×1920, 30 fps, 60 detik), terinspirasi dari
struktur short "Checkmate" (Studio Wrong): layar terbagi atas–bawah, premis catur yang langsung
dipahami, eskalasi curang yang absurd, lalu punchline slapstick. Karakter, cerita, dan semua
aset dibuat sendiri dengan kode (three.js + GSAP), musik & SFX disintesis (`make_audio.py`),
jadi bebas masalah hak cipta.

## Beat sheet

| # | Waktu | Gambar | Teks di layar |
|---|---|---|---|
| 1 | 0–7 s | Ratu menghantam papan, Raja melotot & berkeringat (split screen) | SKAKMAT. / Raja: "Nggak. Belum." / Raja nggak terima kalah. |
| 2 | 7–17 s | Trik #1: Raja sembunyi di balik bidak, Ratu menyentil bidaknya | TRIK #1 SEMBUNYI / …tapi mahkotanya kelihatan. / CTAK! / Masih skakmat. |
| 3 | 17–29 s | Trik #2: papan diputar 2×, semua kembali ke posisi awal | TRIK #2 PUTAR PAPAN / WHUUUSH! / Raja pusing. Ratu santai. |
| 4 | 29–41 s | Trik #3: lepas mahkota, mengecil, pakai kacamata+kumis palsu | TRIK #3 MENYAMAR / "Aku cuma bidak, kok." / "Bidak punya kumis?" / Ketahuan. |
| 5 | 41–48 s | Trik #4: roket, hitung mundur, kepala kena lampu, jatuh, semua bidak roboh | TRIK #4 ROKET / 3-2-1 / DUAK! / BRAK! |
| 6 | 48–60 s | Raja terkapar pusing, Ratu tetap berdiri & mengedip | SKAKMAT. / (kali ini beneran.) / Tim Raja atau Tim Ratu? Tulis di komen! |

Titik potong untuk menyelaraskan musik lain (120 BPM): 0.35, 7, 12.05, 17, 18.8, 29, 32.4, 38, 41, 45, 45.6, 46.5, 49, 53.

## Render ulang

```bash
bash <skill>/scripts/setup_project.sh .           # tautkan node_modules
node <skill>/scripts/render.mjs . --stills 0,12,45.6   # cek frame
node <skill>/scripts/render.mjs . --scale 0.6667       # video (tanpa suara)
python3 make_audio.py                                  # out/audio.wav
```
