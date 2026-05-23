export const RELIVE_FEAST_GRID_SIZE = 9;

/** Default Relive the Feast pool (editable in Admin → Site pages → Home). */
export const DEFAULT_RELIVE_FEAST_IMAGES: readonly string[] = [
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790072/_MG_3350-2_d2kogx.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790119/IMG_9592_hfxaaj.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790097/205A6376_ucpyqt.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779112495/gr6_ebogvw.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779112510/gr4_k2aqom.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779126489/ev1_wytnu0.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779126489/ev2_fxwmmb.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779126490/ev3_lhay3t.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1779276508/20250220_221435_yln56r.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761833/20260221_001253_0_lfigst.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761818/20260220_132704_0_tjd3wo.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761814/20260220_132002_nowz9r.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761809/20260220_131920_aw9wt5.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761788/20260220_131145_swgwc6.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761781/20260220_125225_mohjmy.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761766/20260219_224056_u8nneu.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761762/20260219_223755_odcohd.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761751/20260219_223535_jgk9ex.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761737/20260219_131759_g3t4jm.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761726/20260219_130355_m6sfrm.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761721/20260219_114319_ljqxqc.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761713/20260219_114037_gie8cl.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761676/20250711_225311_zng8tc.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761673/20250711_224758_g4no2c.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761661/20250711_200106_dxgplr.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761652/20250711_124809_yc1yww.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761624/20250710_214224_emxlp3.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761600/20250710_211840_x3q0zv.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761586/20250710_122145_ffvnun.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761583/20250710_121804_zs9qxu.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761533/20250710_085539_dzi7v9.jpg',
] as const;

export function dedupeReliveImageUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    const url = raw.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Nine distinct URLs for the grid — no duplicates on first paint. */
export function initialReliveGridUrls(pool: string[]): string[] {
  const unique = dedupeReliveImageUrls(pool);
  if (unique.length < RELIVE_FEAST_GRID_SIZE) return [];
  return shuffle(unique).slice(0, RELIVE_FEAST_GRID_SIZE);
}

/** Pick a random URL from the pool that no other cell is currently showing. */
export function nextReliveCellUrl(pool: string[], currentCells: string[], cellIndex: number): string {
  const unique = dedupeReliveImageUrls(pool);
  const used = new Set(currentCells.filter((_, i) => i !== cellIndex));
  const available = unique.filter((url) => !used.has(url));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)]!;
  }
  return currentCells[cellIndex] ?? unique[cellIndex % unique.length] ?? '';
}
