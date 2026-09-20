// Minefield engine - shared between app and node tests
function makeBoard(rows, cols, mines, safeR, safeC) {
  // place mines avoiding safeR/safeC and its neighbors (first-click open)
  const banned = new Set();
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    const r = safeR + dr, c = safeC + dc;
    if (r >= 0 && r < rows && c >= 0 && c < cols) banned.add(r * cols + c);
  }
  const spots = [];
  for (let i = 0; i < rows * cols; i++) if (!banned.has(i)) spots.push(i);
  // Fisher-Yates
  for (let i = spots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = spots[i]; spots[i] = spots[j]; spots[j] = t;
  }
  const mine = new Array(rows * cols).fill(false);
  for (let i = 0; i < mines; i++) mine[spots[i]] = true;
  const adj = new Array(rows * cols).fill(0);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (mine[r * cols + c]) continue;
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols && mine[rr * cols + cc]) n++;
    }
    adj[r * cols + c] = n;
  }
  return { mine, adj };
}
function floodReveal(state, r, c) {
  // returns list of newly revealed indexes; mutates revealed set
  const { rows, cols, adj, mine, revealed, flagged } = state;
  const out = [];
  const stack = [r * cols + c];
  while (stack.length) {
    const i = stack.pop();
    if (revealed.has(i) || flagged.has(i)) continue;
    revealed.add(i);
    out.push(i);
    if (adj[i] === 0 && !mine[i]) {
      const rr = Math.floor(i / cols), cc = i % cols;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const r2 = rr + dr, c2 = cc + dc;
        if (r2 >= 0 && r2 < rows && c2 >= 0 && c2 < cols) {
          const j = r2 * cols + c2;
          if (!revealed.has(j) && !flagged.has(j)) stack.push(j);
        }
      }
    }
  }
  return out;
}
function chordTargets(state, r, c) {
  const { rows, cols, adj, revealed, flagged } = state;
  const i = r * cols + c;
  if (!revealed.has(i) || adj[i] === 0) return { ok: false, targets: [] };
  let flags = 0;
  const targets = [];
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    const rr = r + dr, cc = c + dc;
    if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) continue;
    const j = rr * cols + cc;
    if (flagged.has(j)) flags++;
    else if (!revealed.has(j)) targets.push(j);
  }
  return { ok: flags === adj[i] && targets.length > 0, targets };
}
function isWin(state) {
  const { rows, cols, mine, revealed } = state;
  let safe = 0, rev = 0;
  for (let i = 0; i < rows * cols; i++) {
    if (!mine[i]) { safe++; if (revealed.has(i)) rev++; }
  }
  return rev === safe;
}
if (typeof module !== 'undefined') module.exports = { makeBoard, floodReveal, chordTargets, isWin };
