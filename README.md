# [Ohrni](https://jupiterpi.github.io/ohrni/)

> [!WARNING]
> **Author's note:**
> Ohrni is mostly or entirely vibe-coded, to explore technical possibilities and get this specific tool working fast.

Ohrni is a tiny ear training playground — named after *Ornithology* and the German word for ear, *Ohr*. It’s not a conservatory tool, just a small project for musicians and music nerds who enjoy poking at their ears for fun.

## What you can do

- **Interval practice**
  Hear two notes in a comfortable two‑octave range: first the **lower**, then the **higher**, then **both together**. Guess the interval (unison up to octave), get instant feedback, and watch your streak climb.

- **Chord practice**
  Explore lush **four‑note** voicings (maj, min, dim7, aug, maj7, 7, add6, min7, min6). Each round plays an **arpeggio** followed by the **full chord**, then asks you to name the quality and shows you the spelling (C–E–G–B, etc.).

- **Smart randomiser**
  Questions are drawn from a sliding history window so every interval and chord quality appears regularly, but the pool always has multiple candidates — impossible to meta-guess what’s coming next. The root note also never repeats back-to-back.

- **Detailed per-session stats**
  Beyond the overall accuracy and streak, a per-item breakdown shows your hit rate on every individual interval or chord quality, plus the top three things you confused each one with. Resets when you end the session.

- **Playback speed toggle**
  Switch between **Normal** and **Slow** at any time. Slow mode stretches note durations and gaps so your ears have more time to lock on — useful when starting out or working through tricky intervals.

- **German label option**
  Toggle between English and German interval/chord abbreviations (e.g. *g3* instead of M3, *D* instead of Major).

- **Zero pressure**
  No accounts, no leaderboards. Best streak is stored locally in your browser.

## Tech bits

- Built with **Bun**, **React**, and **Tailwind CSS**
- Audio via the **Web Audio API** and sampled piano sounds
- Deployed as a static site on **GitHub Pages**

Fire it up in a browser, put on headphones, and let your ears wander.
