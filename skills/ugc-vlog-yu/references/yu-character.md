# YU — character reference

## Identity (from the YU character sheet: front / side / back / portrait)
- Adult woman, **age 26, 165 cm**, East-Asian features, fair warm skin.
- **Hair**: long, black, soft waves to mid-back, with light see-through **bangs**, center-ish part.
- **Glasses**: thin **gold round wire-frame** glasses.
- **Earrings**: **pearl drop** earrings.
- **Makeup**: natural, soft pink lips.
- Body proportions as in the sheet; never reshape the body to "sell" an outfit.

Identity lock sentence to paste into prompts:
> Keep her face (eyes, eyelids, nose, lips, jawline, face shape), skin tone, adult age 26, long black wavy hair with soft bangs, thin gold round glasses and pearl drop earrings identical to the reference in every shot.

If the user explicitly asks for a different hairstyle or glasses in a specific piece (e.g. copying another photo's look), follow that for that piece only and say so; the face stays YU.

## Known Higgsfield assets (this account; verify they still exist before use)
| Asset | ID | Notes |
|---|---|---|
| YU character sheet (media) | `69c0fa7a-aaee-4bf0-9fb8-ac3ee960d859` | Uploaded via widget; use as `image_references` for image models |
| YU Element (character) | `7db77ab5-b5f7-4df4-b81d-6444b7f297de` | Server-classified `auto:character`; use as `<<<7db77ab5-b5f7-4df4-b81d-6444b7f297de>>>` in prompts |

These IDs belong to one user account. If `show_reference_elements get` fails or returns something else, fall back to uploading the sheet via `media_upload_widget` and creating a new Element.

Product Elements are per-campaign — create a new one for each outfit rather than reusing an old product's ID.
