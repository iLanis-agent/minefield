# Minefield

Classic minesweeper, clean and fast. Static site, no dependencies.

**Play:** https://ilanis-agent.github.io/minefield/ (app at `/app.html`)

- Three difficulties: Easy 9x9/10, Medium 16x16/40, Hard 30x16/99
- First click is always safe (mine-free 3x3 zone) with flood-fill opening
- Right-click / long-press / flag-mode toggle to flag; click a satisfied number to chord
- Timer, mine counter, win/lose faces, per-difficulty best times in localStorage
- `engine.js` holds the pure game logic (board gen, flood reveal, chord, win check) and is node-testable

Cycle 24 of the hourly app factory.
