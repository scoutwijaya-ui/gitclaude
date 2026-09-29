---
name: ugc-vlog-yu
description: Produce a finished short vertical UGC outfit vlog video (default 15 s, 9:16, Indonesian dialogue) starring the AI character YU (age 26, 165 cm, long black wavy hair with bangs, thin gold round glasses, pearl earrings) using Higgsfield. Use this whenever the user asks to "generate/buat video", "short vlog", "UGC outfit", "try-on", "OOTD", "unboxing outfit" or "review outfit" with YU, "karakter ini", the YU character sheet, or an outfit/product photo they want YU to wear — even if they only say "pakai karakter ini" or "lanjut video". Covers storyboard, identity/product locking, cost check, generation, and QA of the actual result.
---

# UGC Vlog YU

Turn an outfit (product photo or description) into a finished short vlog video starring YU. The deliverable is a **real rendered video**, not just a prompt — a prompt alone only counts as done if generation is genuinely blocked, and then say exactly what blocked it.

Write to the user in casual, warm Indonesian unless they switch language. Model prompts can be in English; spoken dialogue stays Indonesian.

## 1. Lock the inputs

Read `references/yu-character.md` for YU's identity description and known Higgsfield asset IDs.

- **Character**: YU is the default. If the user attaches the YU sheet again or a new YU photo, prefer the freshest reference. Never swap in a random avatar or a product model's face — if no usable YU reference exists in Higgsfield, get one uploaded first (see §3).
- **Outfit**: from the user's product photo, or from their description. Write down what is actually visible — color, knit/print, neckline, sleeves, belt/ties, hem, skirt/pants length, bag shape, shoes. Keep these words identical across every shot prompt; that is what keeps the product from drifting between shots.
- **Don't invent product facts.** Fabric, fit, comfort, stretch, transparency and price can't be seen in a photo. YU is an AI character, so dialogue describes what is visible ("ada tali pinggangnya", "rok lipitnya rapi") rather than claiming lived experience ("adem seharian", "udah aku pakai seminggu"). This keeps the content honest when it's posted as promotion.
- **Modesty**: open-knit, sheer or lace items get a same-color inner camisole/lining in the prompt so the render stays opaque, unless the user says otherwise.
- Ask a question only if the outfit itself is unknown. Duration, format, setting and tone have defaults below.

## 2. Storyboard (default 15 s, 5 shots × 3 s)

Default arc, adapt to the product:

| Time | Shot | Purpose |
|---|---|---|
| 0–3 s | Hook — unboxing or holding the outfit up, smile to camera | Show the product immediately |
| 3–6 s | Detail close-up of the hero item (texture, tie, pleats, buttons) | Visual proof for the first claim |
| 6–9 s | Match cut → mirror try-on, full outfit, small turn | Outfit on body |
| 9–12 s | Second item / accessory detail (bag, shoes) | Complete the set |
| 12–15 s | Final look outdoors (café sidewalk, golden light), walk + half-turn | Aspirational payoff |

- **Dialogue** ≈ 25–30 words total for 15 s (about 5–6 words per shot). Every line must match what's on screen at that moment.
- **Settings**: cozy bedroom (cream bedding, warm lamp) → mirror → window light → café street. Warm brown-cream grade suits YU; change it if the product palette clashes.
- For 30 s: 5 shots × 6 s and ~55–65 words.

Show the user the storyboard table briefly, then proceed to generation in the same turn — they asked for a video, and the storyboard is there so they can follow along, not a gate.

## 3. Get references into Higgsfield

The sandbox usually **cannot reach Higgsfield upload/CDN hosts** (proxy 403). So:

1. First check `show_reference_elements` (list) for an existing YU character element and product element. Reuse them when they match.
2. If a needed image isn't in Higgsfield yet, call `media_upload_widget` as the **only** tool in that turn (type image, multiple, min/max = number of images, label telling the user which image is which). Stop and wait for the user.
3. When the user says it's uploaded (e.g. "lanjut"), find the new media via `show_medias`. You can't view the images from the sandbox, so create an Element from each (`show_reference_elements` action=create, category auto) — the server's `auto:character` vs `auto:prop` classification tells you which is YU and which is the outfit.

## 4. Generate

Read `references/prompt-template.md` and fill it in.

- **Model**: `kling3_0` — multi-shot, native audio, lip-sync, supports Elements via `<<<element_id>>>` placeholders in the prompt. Settings: `duration` 15 (range 3–15), `aspect_ratio` "9:16", `mode` "pro", `sound` "on". Confirm limits with `models_explore get` if unsure; they change.
- **Cost first**: call `generate_video` with `get_cost: true`, and `balance`. Mention credits spent in the final report. Proceed without asking if it's within a normal single-video cost; ask if it's unusually high or the balance is low.
- **Preset recommendations**: the server sometimes returns a `preset_recommendation` instead of submitting. If the preset clearly doesn't fit the storyboard (e.g. a dark/horror look for a warm vlog), resubmit with `declined_preset_id` and tell the user you did. If it plausibly fits, ask.
- Submit **once**. Keep the job ID. Poll with `jobs_wait` a few times; a 15 s pro render takes several minutes, so if it's still running, schedule a check-in (`send_later`, ~5 min) instead of polling endlessly.
- Never resubmit after a timeout with unknown outcome — look up the job ID first.

## 5. QA the actual result

A "completed" job is not a passed video. When done:

1. `show_generation_by_ids` to display it, and give the user the direct MP4 link.
2. Try to inspect it. The sandbox usually can't download from the CDN; if so, `media_import_url` the result URL → `video_analysis_create` → poll `video_analysis_status`. Analysis can sit in a queue; check back once or twice, then stop.
3. Compare against the storyboard: YU's face, bangs, glasses and earrings consistent; outfit colors and details unchanged across shots; hands and fingers normal; no see-through fabric; dialogue lines present; total ≈ 15 s.
4. If you couldn't inspect it, say so plainly, and give the user a per-shot checklist so they can report issues by shot number. Don't describe the video as if you had watched it.

Fix concrete defects by tightening only the affected shot's prompt and regenerating, within the cost the user accepted.

## 6. Deliver

Final message (Indonesian, short):
- Video link + where it's displayed; model/settings; credits used.
- QA status — checked (with findings) or not yet checked (with the checklist).
- Any decisions you made on the user's behalf (declined preset, camisole added, glasses kept gold, etc.).
- Offer next steps: cover image, caption with one CTA, or regenerate a specific shot.

For captions: one CTA only; mention AI/promo disclosure when the post promotes a product; no invented links, prices or stock.
