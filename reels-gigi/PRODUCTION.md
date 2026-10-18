# Reels: "Gigi Sehat, Hati Senang!" (dental hygiene, 3D animated)

- Format: 9:16 vertical, 1080x1920, ~38 s
- Look: modern cute 3D animation (Pixar-like, rounder and softer), pastel + bright colors, soft global illumination, clean Instagram aesthetic
- Voiceover: Everygen voice (`voiceId: everygen`) in Everygen/Viewmax
- Music: upbeat, bouncy kids-pop / ukulele + claps, ~120 BPM, under the voice

## Voiceover script (Indonesian)

The `...` marks are deliberate pauses that keep the narration in step with the scenes.

```
Pagi-pagi, gigi kamu lagi kotor dan kusam? ... Tenang! Teman terbaikmu, sikat gigi dan pasta gigi, siap bantu! ... Yuk, sikat 2 menit sambil goyang-goyang. Bakteri jahat langsung kabur! ... Lihat deh... gigi jadi putih mengkilap, dan senyummu jadi lebih percaya diri! ... Ingat ya, sikat gigi 2 menit, 2 kali sehari. ... Gigi sehat, hati senang!
```

## Characters (keep identical in every shot)

- **Kiki**: cheerful Indonesian girl, about 8, big expressive brown eyes, round cheeks, short black bob with a small yellow hair clip, light tan skin, pastel pink pajamas with tiny white stars, fluffy slippers.
- **Sikat**: friendly toothbrush character, glossy sky-blue handle body, white + mint bristles like a hairdo, big cartoon eyes, wide smile, white cartoon gloves, little sneakers.
- **Pasta**: chubby toothpaste tube, white with red + turquoise stripes, round blue cap like a hat, sparkly eyes, rosy cheeks, huge grin, tiny arms and legs.

Style suffix for every prompt:
> high-quality modern stylized 3D animation, cute soft cartoon render, Pixar-like but rounder and more modern, soft global illumination, vibrant pastel and bright colors, gentle rim light, subsurface scattering on skin, smooth clay-like materials, clean Instagram aesthetic, no text, no logos

## Shot list

| # | Time | Scene | Narration | Camera | Start-frame prompt (image) | Motion prompt (video) |
|---|------|-------|-----------|--------|----------------------------|------------------------|
| 1 | 0–4 s | S1 wake-up | "Pagi-pagi…" | slow push-in | Kiki's pastel bedroom at sunrise, warm sun through curtains, Kiki sitting up in bed mid-yawn, arms stretched, sleepy happy face, alarm clock bouncing on the nightstand | Kiki finishes a big stretch-yawn, rubs her eyes, hops out of bed into her slippers; the alarm clock bounces. Slow push-in. SFX: alarm ring, yawn, soft hop |
| 2 | 4–8 s | S1 mirror | "…gigi kamu lagi kotor dan kusam?" | push-in to close-up | Pastel bathroom, Kiki at the mirror grinning wide; her teeth look yellowish with little food bits; reflection visible | Her grin melts into an exaggerated sad pout, big watery eyes, shoulders drop; the camera pushes in on her reflection. SFX: sad "wah-wah" trombone sting |
| 3 | 8–12 s | S2 entrance | "Tenang! Teman terbaikmu…" | quick whip to counter | Sink counter, Sikat and Pasta mid-jump into frame from behind a cup, arms up, huge smiles | Sikat and Pasta pop up and land on the counter with a bounce, strike a "ta-da!" pose and wave at Kiki. SFX: boing, sparkle chime |
| 4 | 12–16 s | S2 invite | "…siap bantu! Yuk," | low angle, slight tilt-up | Pasta squeezing a perfect swirl of minty paste onto Sikat's bristles; Kiki surprised and delighted in the background | Pasta squeezes the paste swirl; Sikat does a little dance shimmy and points at Kiki, inviting her to dance; Kiki giggles. SFX: squish, giggle |
| 5 | 16–21 s | S3 dance | "…sikat 2 menit sambil goyang-goyang." | **orbit 180° around Kiki** | Kiki brushing her teeth with Sikat, hips swaying, Pasta dancing on the counter, foam bubbles floating, colorful soft light | Kiki brushes in rhythm, swaying side to side; Pasta dances; bubbles float up. The camera orbits smoothly around her. SFX: brushing swish on the beat, bubbles |
| 6 | 21–25 s | S3 bacteria | "Bakteri jahat langsung kabur!" | inside-the-mouth close-up, tracking | Macro view of the teeth: tiny cute green and purple germ characters and food crumbs with scared faces, foam wave approaching | A wave of minty foam sweeps across; the germs scream comically, grab their crumbs and run off screen, one slipping on the foam. SFX: tiny screams, cartoon zip-away |
| 7 | 25–29 s | S4 sparkle | "Lihat deh… gigi jadi putih mengkilap" | push-in | Kiki close-up, grin showing bright clean white teeth, first glints of sparkle | Her teeth flash brilliant white with star-shaped sparkles popping; her eyes widen in delight. SFX: ding-sparkle |
| 8 | 29–33 s | S4 high-five | "…senyummu jadi lebih percaya diri!" | slight orbit, medium shot | Kiki and Sikat facing each other, hands raised for a high-five, Pasta cheering below | They high-five with a burst of sparkles and a little confetti; Pasta jumps for joy. SFX: high-five slap, cheer |
| 9 | 33–38 s | S5 ending | "Ingat ya… Gigi sehat, hati senang!" | **final close-up on the smile** | Kiki's big confident sparkling smile, Sikat and Pasta peeking in from the sides, pastel background | Slow push-in to the sparkling smile; a twinkle on a tooth. Text overlay (added in the edit): **"Brush 2 minutes, twice a day!"** SFX: final sparkle chime |

## Assembly

1. Character key image (all three characters, plain pastel backdrop); use it as the reference for every start frame.
2. Generate 9 start frames (9:16), then 9 image-to-video clips (4–5 s each, 720p+).
3. Stitch in order, lay the voiceover on top, add the upbeat music bed at about −18 dB under the voice, keep the clips' SFX quiet.
4. On-screen text in the last 5 s: "Brush 2 minutes, twice a day!" (rounded bold font, e.g. Fredoka/Lilita One, white with a soft pink outline).
5. Optional: small white captions low in the frame.
