"""Synthesise the soundtrack for the Skakmat reel: a bouncy 120 BPM loop plus SFX
timed to the beats in index.html. Writes out/audio.wav (48 kHz stereo, 60 s).
All sounds are generated here, so there are no licensing issues."""
import wave
import numpy as np

SR = 48000
DUR = 60.0
N = int(SR * DUR)
music = np.zeros(N)
sfx = np.zeros(N)
rng = np.random.default_rng(7)


def t_arr(d):
    return np.arange(int(SR * d)) / SR


def add(buf, at, sig, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def env(d, a=0.005, r=None):
    t = t_arr(d)
    r = r if r is not None else d
    e = np.minimum(1, t / a) * np.exp(-t / (r / 5))
    return e


def note(f):
    return 440 * 2 ** ((f - 69) / 12)


# ---------------- music ----------------
BPM = 120
beat = 60 / BPM
prog = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]  # C G Am F
mel = [72, 74, 76, 79, 76, 74, 72, 67]


def kick():
    t = t_arr(0.35)
    f = 50 + 120 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def hat(d=0.05):
    return rng.standard_normal(int(SR * d)) * np.exp(-t_arr(d) * 90) * 0.5


def snare():
    d = 0.2
    t = t_arr(d)
    return (rng.standard_normal(len(t)) * 0.6 + np.sin(2 * np.pi * 190 * t) * 0.5) * np.exp(-t * 22)


def pluck(f, d=0.3):
    t = t_arr(d)
    s = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * t)
    return s * np.exp(-t * 9)


def bell(f, d=0.4):
    t = t_arr(d)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t * 7)


nbeats = int(DUR / beat)
for b in range(nbeats):
    at = b * beat
    bar = b // 4
    root, chord = prog[bar % 4]
    # drop the drums during the rocket countdown for tension, slam back after the crash
    tension = 42.7 <= at < 46.5
    if not tension:
        add(music, at, kick(), 0.55)
        if b % 2 == 1:
            add(music, at, snare(), 0.22)
    for h in range(2):
        add(music, at + h * beat / 2, hat(), 0.12 if not tension else 0.2)
    add(music, at, pluck(note(root), 0.35), 0.16)
    add(music, at + beat / 2, pluck(note(root + 12), 0.2), 0.1)
    if b % 2 == 0 and not tension:
        for n in chord:
            add(music, at + beat / 2, pluck(note(n), 0.18), 0.05)
    if bar % 2 == 1 and not tension:
        add(music, at, bell(note(mel[(b * 3) % 8]), 0.35), 0.07)
    if tension:  # rising tick
        add(music, at, bell(note(72 + int((at - 42.7) * 4)), 0.12), 0.08)

# ---------------- sfx ----------------
def thud(d=0.3, f0=140):
    t = t_arr(d)
    f = f0 * np.exp(-t * 6) + 40
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) + rng.standard_normal(len(t)) * 0.2) * np.exp(-t * 14)


def whoosh(d=0.6, f_lo=300, f_hi=2500):
    n = int(SR * d)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    t = np.arange(n) / n
    # sweep a one-pole lowpass cutoff up and down
    cut = f_lo + (f_hi - f_lo) * np.sin(np.pi * t)
    a = np.exp(-2 * np.pi * cut / SR)
    y = 0.0
    for i in range(n):
        y = a[i] * y + (1 - a[i]) * noise[i]
        out[i] = y
    return out * np.sin(np.pi * t) * 3


def boing(d=0.45, f0=180, f1=520):
    t = t_arr(d)
    f = f0 + (f1 - f0) * (t / d) + 40 * np.sin(2 * np.pi * 14 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)


def click(f=2400, d=0.06):
    t = t_arr(d)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 80) + rng.standard_normal(len(t)) * np.exp(-t * 120) * 0.4


def pop(d=0.12):
    t = t_arr(d)
    f = 900 * np.exp(-t * 25) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)


def stinger():
    t = t_arr(0.5)
    s = sum(np.sin(2 * np.pi * note(n) * t) for n in (72, 76, 79, 84)) / 3
    return s * np.exp(-t * 6)


def gulp():
    t = t_arr(0.25)
    f = 500 - 300 * t / 0.25
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10)


def beep(f=1000, d=0.18):
    t = t_arr(d)
    return np.sign(np.sin(2 * np.pi * f * t)) * 0.5 * np.minimum(1, (d - t) * 60)


def roar(d=0.8):
    n = int(SR * d)
    noise = rng.standard_normal(n)
    y = np.zeros(n)
    acc = 0.0
    for i in range(n):
        acc = 0.92 * acc + 0.08 * noise[i]
        y[i] = acc
    t = np.arange(n) / SR
    return y * 4 * np.minimum(1, t / 0.05) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t))


def bonk():
    t = t_arr(0.6)
    s = np.sin(2 * np.pi * 520 * t) + 0.6 * np.sin(2 * np.pi * 1390 * t) + 0.4 * np.sin(2 * np.pi * 2210 * t)
    out = s * np.exp(-t * 7)
    th = thud(0.3, 200)
    out[: len(th)] += th * 0.8
    return out


def fall_whistle(d=0.8):
    t = t_arr(d)
    f = 1800 - 1300 * (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5 * np.minimum(1, t / 0.05)


def clatter(at0, n=11):
    for i in range(n):
        add(sfx, at0 + i * 0.045 + rng.uniform(0, 0.02), click(rng.uniform(1500, 3500), 0.05), 0.35)
        add(sfx, at0 + i * 0.045 + 0.3, thud(0.15, 260), 0.25)


def ding():
    t = t_arr(1.2)
    return (np.sin(2 * np.pi * 1318 * t) + 0.4 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 3)


add(sfx, 0.35, thud(0.4, 120), 0.9)           # queen slams down
add(sfx, 0.9, gulp(), 0.35)                    # king's eyes pop
add(sfx, 3.2, whoosh(0.25, 400, 1500), 0.15)   # head shake
for t0 in (7.0, 17.0, 29.0, 41.0):             # trick title cards
    add(sfx, t0, stinger(), 0.35)
add(sfx, 8.0, boing(), 0.4)                    # king hops
add(sfx, 8.6, thud(0.2, 180), 0.4)
add(sfx, 10.4, whoosh(0.6, 200, 900), 0.2)     # queen slides
add(sfx, 12.05, click(2800, 0.08), 0.8)        # CTAK!
add(sfx, 12.08, whoosh(0.7, 600, 3000), 0.3)   # pawn flies off
add(sfx, 13.2, whoosh(0.6, 200, 900), 0.2)
add(sfx, 18.8, whoosh(2.6, 200, 2200), 0.5)    # board spin
add(sfx, 21.4, boing(0.6, 400, 150), 0.3)      # dizzy
add(sfx, 30.8, pop(), 0.5)                     # crown off
add(sfx, 31.6, click(1800), 0.4)               # crown lands
add(sfx, 31.8, boing(0.45, 500, 160), 0.35)    # squash down
add(sfx, 32.4, pop(), 0.6)                     # disguise on
add(sfx, 38.0, click(2200), 0.6)               # tap
add(sfx, 38.15, whoosh(0.5, 500, 2500), 0.3)   # disguise flies
add(sfx, 38.3, boing(0.4, 160, 600), 0.35)     # spring back
add(sfx, 38.5, pop(), 0.4)                     # crown back
add(sfx, 42.8, roar(2.8), 0.15)                # flame idle
for t0, f in ((43.0, 880), (43.7, 880), (44.4, 880)):
    add(sfx, t0, beep(f), 0.25)
add(sfx, 45.0, roar(0.65), 0.6)                # launch
add(sfx, 45.0, beep(1760, 0.3), 0.2)
add(sfx, 45.6, bonk(), 0.9)                    # DUAK!
add(sfx, 45.7, fall_whistle(0.78), 0.3)
add(sfx, 46.48, thud(0.5, 110), 1.0)           # BRAK!
clatter(46.52)
add(sfx, 47.4, thud(0.25, 160), 0.5)           # king tips over
add(sfx, 49.0, ding(), 0.35)                   # SKAKMAT
add(sfx, 51.7, pop(), 0.25)                    # wink

mix = music * 0.7 + sfx
mix /= max(1e-9, np.max(np.abs(mix))) / 0.89
fade = int(SR * 1.0)
mix[-fade:] *= np.linspace(1, 0, fade)
stereo = np.stack([mix, mix], axis=1)
pcm = (stereo * 32767).astype(np.int16)
with wave.open('out/audio.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote out/audio.wav')
